// Settings View Component
import { useState, useEffect } from 'react'
import { Save } from 'lucide-react'
import { BookingSettings } from '@/types/admin'

interface SettingsViewProps {
    settings: BookingSettings | null
    onUpdate: (updates: Partial<BookingSettings>) => void
}

export default function SettingsView({ settings, onUpdate }: SettingsViewProps) {
    const [formData, setFormData] = useState<Partial<BookingSettings>>({})

    useEffect(() => {
        if (settings) {
            setFormData(settings)
        }
    }, [settings])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onUpdate(formData)
    }

    if (!settings) return <div>Cargando configuración...</div>

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Configuración de Reservas</h2>

            {/* Help Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">¿Cómo funcionan estos ajustes?</h3>
                <div className="text-sm text-blue-800 space-y-2">
                    <p><strong>Duración de slots:</strong> Intervalo de tiempo entre cada horario disponible (ej: 30 min = horarios cada 30 minutos)</p>
                    <p><strong>Tiempo de buffer:</strong> Tiempo de descanso entre citas para preparación y limpieza</p>
                    <p><strong>Días máximos de anticipación:</strong> Cuántos días en el futuro pueden reservar los clientes</p>
                    <p><strong>Horas mínimas de anticipación:</strong> Tiempo mínimo antes de la cita para permitir reservas</p>
                    <p><strong>Requerir confirmación:</strong> Si está activado, las citas necesitan confirmación manual antes de ser válidas</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Días máximos de anticipación
                        </label>
                        <input
                            type="number"
                            value={formData.maxAdvanceDays || 90}
                            onChange={(e) => setFormData({ ...formData, maxAdvanceDays: parseInt(e.target.value) })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white text-gray-900"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Duración de slots (minutos)
                        </label>
                        <input
                            type="number"
                            value={formData.slotDuration || 30}
                            onChange={(e) => setFormData({ ...formData, slotDuration: parseInt(e.target.value) })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white text-gray-900"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tiempo de buffer (minutos)
                        </label>
                        <input
                            type="number"
                            value={formData.bufferTime || 15}
                            onChange={(e) => setFormData({ ...formData, bufferTime: parseInt(e.target.value) })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white text-gray-900"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Horas mínimas de anticipación
                        </label>
                        <input
                            type="number"
                            value={formData.minBookingHours || 2}
                            onChange={(e) => setFormData({ ...formData, minBookingHours: parseInt(e.target.value) })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white text-gray-900"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <label className="flex items-center text-gray-700">
                        <input
                            type="checkbox"
                            checked={formData.allowSameDay || false}
                            onChange={(e) => setFormData({ ...formData, allowSameDay: e.target.checked })}
                            className="mr-2"
                        />
                        Permitir reservas el mismo día
                    </label>

                    <label className="flex items-center text-gray-700">
                        <input
                            type="checkbox"
                            checked={formData.requireConfirmation || false}
                            onChange={(e) => setFormData({ ...formData, requireConfirmation: e.target.checked })}
                            className="mr-2"
                        />
                        Requerir confirmación
                    </label>
                </div>

                <button
                    type="submit"
                    className="flex items-center gap-2 bg-amber-500 text-white px-6 py-3 rounded-lg hover:bg-amber-600 transition-colors"
                >
                    <Save className="w-4 h-4" />
                    Guardar Configuración
                </button>
            </form>
        </div>
    )
}
