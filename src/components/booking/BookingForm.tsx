'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, User, Mail, Phone, Calendar, Clock, CheckCircle } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface TimeSlot {
    time: string
    datetime: string
    endTime: string
    employeeId: string
    employeeName: string
    serviceId: string
    serviceName: string
    duration: number
    price: number | null
}

interface BookingFormProps {
    slot: TimeSlot
    businessSlug?: string
    onBack: () => void
    onSuccess: (appointment: any) => void
}

export default function BookingForm({ slot, businessSlug = 'sample-business', onBack, onSuccess }: BookingFormProps) {
    const [formData, setFormData] = useState({
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        notes: ''
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.clientName || !formData.clientEmail) {
            setError('Nombre y email son obligatorios')
            return
        }

        try {
            setLoading(true)
            setError(null)

            const response = await fetch('/api/appointments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    serviceId: slot.serviceId,
                    employeeId: slot.employeeId,
                    startTime: slot.datetime,
                    endTime: slot.endTime,
                    clientName: formData.clientName,
                    clientEmail: formData.clientEmail,
                    clientPhone: formData.clientPhone || null,
                    notes: formData.notes || null,
                    businessSlug
                })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Error al crear la cita')
            }

            onSuccess(data.appointment)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al crear la cita')
        } finally {
            setLoading(false)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    return (
        <div className="max-w-2xl mx-auto px-4">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-8"
            >
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Volver a horarios</span>
                </button>

                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Confirmar Cita
                    </h2>

                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-amber-500" />
                            <div>
                                <div className="font-medium text-gray-900">
                                    {format(new Date(slot.datetime), 'EEEE, dd MMMM yyyy', { locale: es })}
                                </div>
                                <div className="text-sm text-gray-600 capitalize">
                                    {format(new Date(slot.datetime), 'EEEE', { locale: es })}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Clock className="w-5 h-5 text-amber-500" />
                            <div>
                                <div className="font-medium text-gray-900">
                                    {slot.time} - {slot.duration} minutos
                                </div>
                                <div className="text-sm text-gray-600">
                                    con {slot.employeeName}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-amber-500" />
                            <div>
                                <div className="font-medium text-gray-900">
                                    {slot.serviceName}
                                </div>
                                {slot.price && (
                                    <div className="text-sm text-gray-600">
                                        €{slot.price}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Form */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6"
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 mb-2">
                            <User className="w-4 h-4 inline mr-2" />
                            Nombre completo *
                        </label>
                        <input
                            type="text"
                            id="clientName"
                            name="clientName"
                            value={formData.clientName}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors bg-white text-gray-900 placeholder-gray-500"
                            placeholder="Tu nombre completo"
                        />
                    </div>

                    <div>
                        <label htmlFor="clientEmail" className="block text-sm font-medium text-gray-700 mb-2">
                            <Mail className="w-4 h-4 inline mr-2" />
                            Email *
                        </label>
                        <input
                            type="email"
                            id="clientEmail"
                            name="clientEmail"
                            value={formData.clientEmail}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors bg-white text-gray-900 placeholder-gray-500"
                            placeholder="tu@email.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="clientPhone" className="block text-sm font-medium text-gray-700 mb-2">
                            <Phone className="w-4 h-4 inline mr-2" />
                            Teléfono (opcional)
                        </label>
                        <input
                            type="tel"
                            id="clientPhone"
                            name="clientPhone"
                            value={formData.clientPhone}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors bg-white text-gray-900 placeholder-gray-500"
                            placeholder="+34 123 456 789"
                        />
                    </div>

                    <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                            Notas adicionales (opcional)
                        </label>
                        <textarea
                            id="notes"
                            name="notes"
                            value={formData.notes}
                            onChange={handleInputChange}
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors resize-none bg-white text-gray-900 placeholder-gray-500"
                            placeholder="Cualquier información adicional que quieras compartir..."
                        />
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-red-600 text-sm mb-2">{error}</p>
                            <p className="text-gray-600 text-xs">
                                Si el problema persiste, llámanos al <strong>+34 123 456 789</strong> para hacer tu reserva por teléfono.
                            </p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-amber-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                <span>Creando cita...</span>
                            </div>
                        ) : (
                            'Confirmar Cita'
                        )}
                    </button>
                </form>
            </motion.div>
        </div>
    )
}
