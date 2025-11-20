// Settings View Component
import { useState, useEffect } from 'react'
import { Save } from 'lucide-react'
import { BookingSettings } from '@/types/admin'
import ScheduleManagement from './ScheduleManagement'

interface SettingsViewProps {
    settings: BookingSettings | null
    onUpdate: (updates: Partial<BookingSettings>) => Promise<void>
}

export default function SettingsView({ settings, onUpdate }: SettingsViewProps) {
    const [activeTab, setActiveTab] = useState<'schedule' | 'advanced'>('schedule')

    if (!settings) return <div>Cargando configuración...</div>

    return (
        <div className="space-y-6">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
                <nav className="flex space-x-8">
                    <button
                        onClick={() => setActiveTab('schedule')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'schedule'
                                ? 'border-amber-500 text-amber-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        Gestión de Horarios
                    </button>
                    <button
                        onClick={() => setActiveTab('advanced')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'advanced'
                                ? 'border-amber-500 text-amber-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        Configuración Avanzada
                    </button>
                </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'schedule' && (
                <ScheduleManagement settings={settings} onUpdate={onUpdate} />
            )}

            {activeTab === 'advanced' && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6">Configuración Avanzada</h2>

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

                    <div className="text-center py-8 text-gray-500">
                        <p>La configuración avanzada se ha movido a la pestaña "Gestión de Horarios"</p>
                        <p className="text-sm mt-2">Allí puedes configurar todos los aspectos del sistema de reservas de manera más organizada.</p>
                    </div>
                </div>
            )}
        </div>
    )
}
