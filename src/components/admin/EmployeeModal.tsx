// Employee Management Modal Component
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, Save, User, Mail, Phone, Clock, Calendar, AlertCircle } from 'lucide-react'
import { Employee, Service } from '@/types/admin'

interface EmployeeModalProps {
    employee: Employee | null
    services: Service[]
    isOpen: boolean
    onClose: () => void
    onSave: (employeeData: Partial<Employee>) => Promise<void>
}

interface WorkingHours {
    dayOfWeek: number
    startTime: string
    endTime: string
    isActive: boolean
}

export default function EmployeeModal({
    employee,
    services,
    isOpen,
    onClose,
    onSave
}: EmployeeModalProps) {

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        isActive: true,
        selectedServices: [] as string[],
        workingHours: [] as WorkingHours[]
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Initialize form data when employee changes
    useEffect(() => {
        if (employee) {
            setFormData({
                name: employee.name,
                email: employee.email || '',
                phone: employee.phone || '',
                isActive: employee.isActive,
                selectedServices: employee.services.map(s => s.id),
                workingHours: employee.workingHours || []
            })
        } else {
            // Reset form for new employee
            setFormData({
                name: '',
                email: '',
                phone: '',
                isActive: true,
                selectedServices: [],
                workingHours: [
                    { dayOfWeek: 1, startTime: '09:00', endTime: '18:00', isActive: true },
                    { dayOfWeek: 2, startTime: '09:00', endTime: '18:00', isActive: true },
                    { dayOfWeek: 3, startTime: '09:00', endTime: '18:00', isActive: true },
                    { dayOfWeek: 4, startTime: '09:00', endTime: '18:00', isActive: true },
                    { dayOfWeek: 5, startTime: '09:00', endTime: '18:00', isActive: true },
                    { dayOfWeek: 6, startTime: '09:00', endTime: '18:00', isActive: true },
                    { dayOfWeek: 0, startTime: '09:00', endTime: '18:00', isActive: false }
                ]
            })
        }
    }, [employee])

    const handleSave = async () => {
        if (!formData.name.trim()) {
            setError('El nombre es obligatorio')
            return
        }

        setLoading(true)
        setError(null)

        try {
            const employeeData = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                isActive: formData.isActive,
                services: formData.selectedServices,
                workingHours: formData.workingHours
            }

            await onSave(employeeData)
            onClose()
        } catch (error) {
            setError('Error al guardar el empleado')
            console.error('Error saving employee:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleServiceToggle = (serviceId: string) => {
        setFormData(prev => ({
            ...prev,
            selectedServices: prev.selectedServices.includes(serviceId)
                ? prev.selectedServices.filter(id => id !== serviceId)
                : [...prev.selectedServices, serviceId]
        }))
    }

    const handleWorkingHoursChange = (dayOfWeek: number, field: keyof WorkingHours, value: any) => {
        setFormData(prev => ({
            ...prev,
            workingHours: prev.workingHours.map(wh =>
                wh.dayOfWeek === dayOfWeek
                    ? { ...wh, [field]: value }
                    : wh
            )
        }))
    }

    const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

    if (!isOpen) return null

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <User className="w-6 h-6" />
                            <h2 className="text-2xl font-bold">
                                {employee ? 'Editar Empleado' : 'Nuevo Empleado'}
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-red-500" />
                            <p className="text-red-700">{error}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Basic Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <User className="w-5 h-5" />
                                Información Básica
                            </h3>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white text-gray-900"
                                    placeholder="Nombre del empleado"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white text-gray-900"
                                    placeholder="email@ejemplo.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white text-gray-900"
                                    placeholder="+34 123 456 789"
                                />
                            </div>

                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                                />
                                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                                    Empleado activo
                                </label>
                            </div>
                        </div>

                        {/* Services */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <Calendar className="w-5 h-5" />
                                Servicios Disponibles
                            </h3>

                            <div className="space-y-2 max-h-40 overflow-y-auto">
                                {services.map(service => (
                                    <div key={service.id} className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            id={`service-${service.id}`}
                                            checked={formData.selectedServices.includes(service.id)}
                                            onChange={() => handleServiceToggle(service.id)}
                                            className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                                        />
                                        <label htmlFor={`service-${service.id}`} className="text-sm text-gray-700">
                                            {service.name} ({service.duration} min - {service.price}€)
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Working Hours */}
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                            <Clock className="w-5 h-5" />
                            Horarios de Trabajo
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {formData.workingHours.map(wh => (
                                <div key={wh.dayOfWeek} className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex items-center gap-3 mb-3">
                                        <input
                                            type="checkbox"
                                            checked={wh.isActive}
                                            onChange={(e) => handleWorkingHoursChange(wh.dayOfWeek, 'isActive', e.target.checked)}
                                            className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                                        />
                                        <label className="font-medium text-gray-900">
                                            {dayNames[wh.dayOfWeek]}
                                        </label>
                                    </div>

                                    {wh.isActive && (
                                        <div className="space-y-2">
                                            <div>
                                                <label className="block text-xs text-gray-600 mb-1">Hora de inicio</label>
                                                <input
                                                    type="time"
                                                    value={wh.startTime}
                                                    onChange={(e) => handleWorkingHoursChange(wh.dayOfWeek, 'startTime', e.target.value)}
                                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-amber-500 focus:border-transparent bg-white text-gray-900"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-600 mb-1">Hora de fin</label>
                                                <input
                                                    type="time"
                                                    value={wh.endTime}
                                                    onChange={(e) => handleWorkingHoursChange(wh.dayOfWeek, 'endTime', e.target.value)}
                                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-amber-500 focus:border-transparent bg-white text-gray-900"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" />
                        {loading ? 'Guardando...' : 'Guardar'}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    )
}
