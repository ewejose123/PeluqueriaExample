// Quick Appointment Creation Component
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, X, Save, User, Mail, Phone, Calendar, Clock } from 'lucide-react'
import { format, addDays } from 'date-fns'
import { es } from 'date-fns/locale'
import { Employee, Service } from '@/types/admin'

interface QuickAppointmentProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
    employees: Employee[]
    services: Service[]
    selectedDate?: Date
}

export default function QuickAppointment({
    isOpen,
    onClose,
    onSuccess,
    employees,
    services,
    selectedDate = new Date()
}: QuickAppointmentProps) {
    const [formData, setFormData] = useState({
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        date: format(selectedDate, 'yyyy-MM-dd'),
        time: '09:00',
        duration: 30,
        employeeId: employees[0]?.id || '',
        serviceId: services[0]?.id || ''
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.clientName.trim()) {
            setError('El nombre del cliente es obligatorio')
            return
        }

        setLoading(true)
        setError(null)

        try {
            const startTime = new Date(`${formData.date}T${formData.time}`)
            const endTime = new Date(startTime.getTime() + formData.duration * 60000)

            const response = await fetch('/api/appointments?businessSlug=sample-business', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    clientName: formData.clientName,
                    clientEmail: formData.clientEmail || null,
                    clientPhone: formData.clientPhone || null,
                    startTime: startTime.toISOString(),
                    endTime: endTime.toISOString(),
                    employeeId: formData.employeeId,
                    serviceId: formData.serviceId,
                    businessSlug: 'sample-business'
                })
            })

            if (response.ok) {
                onSuccess()
                onClose()
                // Reset form
                setFormData({
                    clientName: '',
                    clientEmail: '',
                    clientPhone: '',
                    date: format(selectedDate, 'yyyy-MM-dd'),
                    time: '09:00',
                    duration: 30,
                    employeeId: employees[0]?.id || '',
                    serviceId: services[0]?.id || ''
                })
            } else {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Error al crear la cita')
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido')
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl shadow-xl max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                        <Plus className="w-5 h-5" />
                        Nueva Cita Rápida
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Client Name - Required */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                            <User className="w-4 h-4" />
                            Nombre del Cliente *
                        </label>
                        <input
                            type="text"
                            value={formData.clientName}
                            onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white text-gray-900"
                            placeholder="Nombre completo"
                            required
                        />
                    </div>

                    {/* Date and Time */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                Fecha
                            </label>
                            <input
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                min={format(new Date(), 'yyyy-MM-dd')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white text-gray-900"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                Hora
                            </label>
                            <input
                                type="time"
                                value={formData.time}
                                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white text-gray-900"
                            />
                        </div>
                    </div>

                    {/* Service and Duration */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Servicio</label>
                            <select
                                value={formData.serviceId}
                                onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white text-gray-900"
                            >
                                {services.length === 0 ? (
                                    <option value="">No hay servicios disponibles</option>
                                ) : (
                                    services.map(service => (
                                        <option key={service.id} value={service.id}>{service.name}</option>
                                    ))
                                )}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Duración (min)</label>
                            <select
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white text-gray-900"
                            >
                                <option value={15}>15 min</option>
                                <option value={30}>30 min</option>
                                <option value={45}>45 min</option>
                                <option value={60}>60 min</option>
                                <option value={90}>90 min</option>
                                <option value={120}>120 min</option>
                            </select>
                        </div>
                    </div>

                    {/* Professional */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Profesional</label>
                        <select
                            value={formData.employeeId}
                            onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white text-gray-900"
                        >
                            {employees.length === 0 ? (
                                <option value="">No hay empleados disponibles</option>
                            ) : (
                                employees.map(employee => (
                                    <option key={employee.id} value={employee.id}>{employee.name}</option>
                                ))
                            )}
                        </select>
                    </div>

                    {/* Optional Contact Info */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-medium text-gray-700">Información de Contacto (Opcional)</h4>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                                <Mail className="w-4 h-4" />
                                Email
                            </label>
                            <input
                                type="email"
                                value={formData.clientEmail}
                                onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white text-gray-900"
                                placeholder="email@ejemplo.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                                <Phone className="w-4 h-4" />
                                Teléfono
                            </label>
                            <input
                                type="tel"
                                value={formData.clientPhone}
                                onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white text-gray-900"
                                placeholder="+34 123 456 789"
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50"
                        >
                            <Save className="w-4 h-4" />
                            {loading ? 'Creando...' : 'Crear Cita'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    )
}
