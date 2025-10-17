// Appointment Popup Component
import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Edit, Trash2, Save, User, Mail, Phone, Calendar, Clock, AlertCircle, MessageSquare } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Appointment, Employee, Service } from '@/types/admin'

interface AppointmentPopupProps {
    appointment: Appointment | null
    employees: Employee[]
    services: Service[]
    onClose: () => void
    onUpdate: (appointment: Appointment) => void
    onDelete: (appointmentId: string) => void
}

export default function AppointmentPopup({
    appointment,
    employees,
    services,
    onClose,
    onUpdate,
    onDelete
}: AppointmentPopupProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        startTime: '',
        endTime: '',
        employeeId: '',
        serviceId: '',
        notes: ''
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Initialize form data when appointment changes
    useState(() => {
        if (appointment) {
            setFormData({
                clientName: appointment.clientName,
                clientEmail: appointment.clientEmail,
                clientPhone: appointment.clientPhone || '',
                startTime: format(new Date(appointment.startTime), 'yyyy-MM-dd\'T\'HH:mm'),
                endTime: format(new Date(appointment.endTime), 'yyyy-MM-dd\'T\'HH:mm'),
                employeeId: appointment.employee.id,
                serviceId: appointment.service.id,
                notes: ''
            })
        }
    })

    const handleSave = async () => {
        if (!appointment) return

        setLoading(true)
        setError(null)

        try {
            const response = await fetch(`/api/appointments/${appointment.id}?businessSlug=sample-business`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            if (response.ok) {
                const updatedAppointment = await response.json()
                onUpdate(updatedAppointment)
                setIsEditing(false)
            } else {
                throw new Error('Error al actualizar la cita')
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!appointment) return

        if (confirm('¿Estás seguro de que quieres eliminar esta cita?')) {
            setLoading(true)
            try {
                const response = await fetch(`/api/appointments/${appointment.id}?businessSlug=sample-business`, {
                    method: 'DELETE'
                })

                if (response.ok) {
                    onDelete(appointment.id)
                    onClose()
                } else {
                    throw new Error('Error al eliminar la cita')
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error desconocido')
            } finally {
                setLoading(false)
            }
        }
    }

    if (!appointment) return null

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto mx-4"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-100 bg-gradient-to-r from-amber-50 to-orange-50">
                    <div>
                        <h2 className="text-lg md:text-xl font-bold text-gray-900">
                            {isEditing ? 'Editar Cita' : 'Detalles de la Cita'}
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            {format(new Date(appointment.startTime), 'dd MMMM yyyy', { locale: es })}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="p-2 text-blue-600 hover:bg-blue-100 rounded-xl transition-colors"
                                title="Editar cita"
                            >
                                <Edit className="w-4 h-4" />
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors"
                            title="Cerrar"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 md:p-6 space-y-6">
                    {error && (
                        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700">
                            <AlertCircle className="w-4 h-4" />
                            <span className="text-sm font-medium">{error}</span>
                        </div>
                    )}

                    {/* Client Information */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
                            <div className="p-2 bg-blue-100 rounded-xl">
                                <User className="w-5 h-5 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">Información del Cliente</h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="bg-gray-50 rounded-xl p-3">
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Nombre Completo</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={formData.clientName}
                                        onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white text-gray-900 font-medium"
                                    />
                                ) : (
                                    <p className="text-sm font-medium text-gray-900">{appointment.clientName}</p>
                                )}
                            </div>

                            <div className="bg-gray-50 rounded-xl p-3">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                                    <Mail className="w-4 h-4" />
                                    Email
                                </label>
                                {isEditing ? (
                                    <input
                                        type="email"
                                        value={formData.clientEmail}
                                        onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white text-gray-900 font-medium"
                                    />
                                ) : (
                                    <p className="text-sm font-medium text-gray-900">{appointment.clientEmail}</p>
                                )}
                            </div>

                            <div className="bg-gray-50 rounded-xl p-3">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                                    <Phone className="w-4 h-4" />
                                    Teléfono
                                </label>
                                {isEditing ? (
                                    <input
                                        type="tel"
                                        value={formData.clientPhone}
                                        onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white text-gray-900 font-medium"
                                    />
                                ) : (
                                    <p className="text-sm font-medium text-gray-900">{appointment.clientPhone || 'No proporcionado'}</p>
                                )}
                            </div>

                            <div className="bg-gray-50 rounded-xl p-3">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                                    <MessageSquare className="w-4 h-4" />
                                    Notas
                                </label>
                                {isEditing ? (
                                    <textarea
                                        value={formData.notes}
                                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                        rows={2}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white text-gray-900 font-medium resize-none"
                                        placeholder="Notas adicionales..."
                                    />
                                ) : (
                                    <p className="text-sm font-medium text-gray-900">{appointment.notes || 'Sin notas'}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Appointment Details */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
                            <div className="p-2 bg-green-100 rounded-xl">
                                <Calendar className="w-5 h-5 text-green-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">Detalles de la Cita</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-gray-50 rounded-xl p-4">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    Fecha y Hora
                                </label>
                                {isEditing ? (
                                    <div className="space-y-3">
                                        <input
                                            type="datetime-local"
                                            value={formData.startTime}
                                            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white text-gray-900 font-medium"
                                        />
                                        <input
                                            type="datetime-local"
                                            value={formData.endTime}
                                            onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white text-gray-900 font-medium"
                                        />
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <p className="text-lg font-semibold text-gray-900">
                                            {format(new Date(appointment.startTime), 'dd/MM/yyyy HH:mm', { locale: es })}
                                        </p>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Clock className="w-4 h-4" />
                                            <span>
                                                Duración: {Math.round((new Date(appointment.endTime).getTime() - new Date(appointment.startTime).getTime()) / (1000 * 60))} minutos
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Servicio</label>
                                    {isEditing ? (
                                        <select
                                            value={formData.serviceId}
                                            onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white text-gray-900 font-medium"
                                        >
                                            {services.map(service => (
                                                <option key={service.id} value={service.id}>{service.name}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <p className="text-base font-semibold text-gray-900">{appointment.service.name}</p>
                                    )}
                                </div>

                                <div className="bg-gray-50 rounded-xl p-4">
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Profesional</label>
                                    {isEditing ? (
                                        <select
                                            value={formData.employeeId}
                                            onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white text-gray-900 font-medium"
                                        >
                                            {employees.map(employee => (
                                                <option key={employee.id} value={employee.id}>{employee.name}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                                                {appointment.employee.avatarUrl ? (
                                                    <img
                                                        src={appointment.employee.avatarUrl}
                                                        alt={appointment.employee.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600 font-semibold text-xs">
                                                        {appointment.employee.name.split(' ').map(n => n[0]).join('')}
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-base font-semibold text-gray-900">{appointment.employee.name}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between gap-3 p-4 md:p-6 border-t border-gray-100 bg-gray-50">
                    <button
                        onClick={handleDelete}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-100 rounded-xl transition-colors disabled:opacity-50 font-medium"
                    >
                        <Trash2 className="w-4 h-4" />
                        Eliminar
                    </button>

                    <div className="flex items-center gap-3">
                        {isEditing && (
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-xl transition-colors font-medium"
                            >
                                Cancelar
                            </button>
                        )}
                        <button
                            onClick={isEditing ? handleSave : onClose}
                            disabled={loading}
                            className="flex items-center gap-2 px-6 py-2 bg-amber-600 text-white hover:bg-amber-700 rounded-xl transition-colors disabled:opacity-50 font-semibold"
                        >
                            {isEditing ? (
                                <>
                                    <Save className="w-4 h-4" />
                                    Guardar Cambios
                                </>
                            ) : (
                                'Cerrar'
                            )}
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}
