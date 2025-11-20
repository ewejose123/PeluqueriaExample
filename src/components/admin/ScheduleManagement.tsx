// Global Schedule Management Component
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, Plus, Edit, Trash2, Save, AlertCircle, Settings } from 'lucide-react'
import { BookingSettings } from '@/types/admin'

interface ScheduleManagementProps {
    settings: BookingSettings | null
    onUpdate: (settings: Partial<BookingSettings>) => Promise<void>
}

interface WorkingDay {
    dayOfWeek: number
    isActive: boolean
    startTime: string
    endTime: string
}

interface ScheduleException {
    id: string
    date: string
    isActive: boolean
    startTime: string
    endTime: string
    reason: string
}

export default function ScheduleManagement({ settings, onUpdate }: ScheduleManagementProps) {
    const [activeTab, setActiveTab] = useState<'general' | 'workingDays' | 'exceptions'>('general')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // General settings
    const [generalSettings, setGeneralSettings] = useState({
        advanceBookingDays: 30,
        minBookingHours: 2,
        maxBookingHours: 24,
        slotDuration: 30,
        bufferTime: 15,
        allowSameDay: true,
        requireConfirmation: false,
        cancellationHours: 24
    })

    // Working days
    const [workingDays, setWorkingDays] = useState<WorkingDay[]>([
        { dayOfWeek: 0, isActive: false, startTime: '09:00', endTime: '18:00' }, // Sunday
        { dayOfWeek: 1, isActive: true, startTime: '09:00', endTime: '18:00' },  // Monday
        { dayOfWeek: 2, isActive: true, startTime: '09:00', endTime: '18:00' },  // Tuesday
        { dayOfWeek: 3, isActive: true, startTime: '09:00', endTime: '18:00' },  // Wednesday
        { dayOfWeek: 4, isActive: true, startTime: '09:00', endTime: '18:00' },  // Thursday
        { dayOfWeek: 5, isActive: true, startTime: '09:00', endTime: '18:00' },  // Friday
        { dayOfWeek: 6, isActive: true, startTime: '09:00', endTime: '18:00' }   // Saturday
    ])

    // Schedule exceptions
    const [exceptions, setExceptions] = useState<ScheduleException[]>([])
    const [newException, setNewException] = useState<Partial<ScheduleException>>({
        date: '',
        isActive: true,
        startTime: '09:00',
        endTime: '18:00',
        reason: ''
    })

    const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

    // Initialize data from settings
    useEffect(() => {
        if (settings) {
            setGeneralSettings({
                advanceBookingDays: settings.advanceBookingDays,
                minBookingHours: settings.minBookingHours,
                maxBookingHours: settings.maxBookingHours,
                slotDuration: settings.slotDuration,
                bufferTime: settings.bufferTime,
                allowSameDay: settings.allowSameDay,
                requireConfirmation: settings.requireConfirmation,
                cancellationHours: settings.cancellationHours
            })

            // Convert workingDays object to array
            if (settings.workingDays) {
                const daysArray: WorkingDay[] = Object.entries(settings.workingDays).map(([day, isActive]) => ({
                    dayOfWeek: parseInt(day),
                    isActive: isActive,
                    startTime: '09:00',
                    endTime: '18:00'
                }))
                setWorkingDays(daysArray)
            }
        }
    }, [settings])

    const handleSaveGeneral = async () => {
        setLoading(true)
        setError(null)

        try {
            await onUpdate(generalSettings)
        } catch (error) {
            setError('Error al guardar la configuración general')
            console.error('Error saving general settings:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSaveWorkingDays = async () => {
        setLoading(true)
        setError(null)

        try {
            const workingDaysObject = workingDays.reduce((acc, day) => {
                acc[day.dayOfWeek.toString()] = day.isActive
                return acc
            }, {} as Record<string, boolean>)

            await onUpdate({ workingDays: workingDaysObject })
        } catch (error) {
            setError('Error al guardar los días de trabajo')
            console.error('Error saving working days:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleAddException = () => {
        if (!newException.date || !newException.reason) {
            setError('Fecha y motivo son obligatorios')
            return
        }

        const exception: ScheduleException = {
            id: Date.now().toString(),
            date: newException.date!,
            isActive: newException.isActive!,
            startTime: newException.startTime!,
            endTime: newException.endTime!,
            reason: newException.reason!
        }

        setExceptions([...exceptions, exception])
        setNewException({
            date: '',
            isActive: true,
            startTime: '09:00',
            endTime: '18:00',
            reason: ''
        })
    }

    const handleDeleteException = (id: string) => {
        setExceptions(exceptions.filter(exp => exp.id !== id))
    }

    const handleWorkingDayChange = (dayOfWeek: number, field: keyof WorkingDay, value: any) => {
        setWorkingDays(workingDays.map(day =>
            day.dayOfWeek === dayOfWeek
                ? { ...day, [field]: value }
                : day
        ))
    }

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
                    <Settings className="w-6 h-6" />
                    Gestión de Horarios
                </h2>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <p className="text-red-700">{error}</p>
                </div>
            )}

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
                <nav className="flex space-x-8">
                    {[
                        { id: 'general', label: 'Configuración General', icon: Settings },
                        { id: 'workingDays', label: 'Días de Trabajo', icon: Calendar },
                        { id: 'exceptions', label: 'Excepciones', icon: Clock }
                    ].map((tab) => {
                        const Icon = tab.icon
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                                    ? 'border-amber-500 text-amber-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        )
                    })}
                </nav>
            </div>

            {/* Tab Content */}
            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                {activeTab === 'general' && (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-900">Configuración General</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Días de anticipación para reservas
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="365"
                                    value={generalSettings.advanceBookingDays}
                                    onChange={(e) => setGeneralSettings({ ...generalSettings, advanceBookingDays: parseInt(e.target.value) })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white text-gray-900"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Horas mínimas de anticipación
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={generalSettings.minBookingHours}
                                    onChange={(e) => setGeneralSettings({ ...generalSettings, minBookingHours: parseInt(e.target.value) })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white text-gray-900"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Duración de slots (minutos)
                                </label>
                                <input
                                    type="number"
                                    min="15"
                                    step="15"
                                    value={generalSettings.slotDuration}
                                    onChange={(e) => setGeneralSettings({ ...generalSettings, slotDuration: parseInt(e.target.value) })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white text-gray-900"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tiempo de buffer (minutos)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={generalSettings.bufferTime}
                                    onChange={(e) => setGeneralSettings({ ...generalSettings, bufferTime: parseInt(e.target.value) })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white text-gray-900"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Horas de cancelación
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={generalSettings.cancellationHours}
                                    onChange={(e) => setGeneralSettings({ ...generalSettings, cancellationHours: parseInt(e.target.value) })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white text-gray-900"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="allowSameDay"
                                    checked={generalSettings.allowSameDay}
                                    onChange={(e) => setGeneralSettings({ ...generalSettings, allowSameDay: e.target.checked })}
                                    className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                                />
                                <label htmlFor="allowSameDay" className="text-sm font-medium text-gray-700">
                                    Permitir reservas el mismo día
                                </label>
                            </div>

                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="requireConfirmation"
                                    checked={generalSettings.requireConfirmation}
                                    onChange={(e) => setGeneralSettings({ ...generalSettings, requireConfirmation: e.target.checked })}
                                    className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                                />
                                <label htmlFor="requireConfirmation" className="text-sm font-medium text-gray-700">
                                    Requerir confirmación de reservas
                                </label>
                            </div>
                        </div>

                        <button
                            onClick={handleSaveGeneral}
                            disabled={loading}
                            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
                        >
                            <Save className="w-4 h-4" />
                            {loading ? 'Guardando...' : 'Guardar Configuración'}
                        </button>
                    </div>
                )}

                {activeTab === 'workingDays' && (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-900">Días de Trabajo</h3>

                        <div className="space-y-4">
                            {workingDays.map(day => (
                                <div key={day.dayOfWeek} className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                checked={day.isActive}
                                                onChange={(e) => handleWorkingDayChange(day.dayOfWeek, 'isActive', e.target.checked)}
                                                className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                                            />
                                            <label className="font-medium text-gray-900">
                                                {dayNames[day.dayOfWeek]}
                                            </label>
                                        </div>

                                        {day.isActive && (
                                            <div className="flex items-center gap-4">
                                                <div>
                                                    <label className="block text-xs text-gray-600 mb-1">Inicio</label>
                                                    <input
                                                        type="time"
                                                        value={day.startTime}
                                                        onChange={(e) => handleWorkingDayChange(day.dayOfWeek, 'startTime', e.target.value)}
                                                        className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-amber-500 focus:border-transparent bg-white text-gray-900"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-gray-600 mb-1">Fin</label>
                                                    <input
                                                        type="time"
                                                        value={day.endTime}
                                                        onChange={(e) => handleWorkingDayChange(day.dayOfWeek, 'endTime', e.target.value)}
                                                        className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-amber-500 focus:border-transparent bg-white text-gray-900"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={handleSaveWorkingDays}
                            disabled={loading}
                            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
                        >
                            <Save className="w-4 h-4" />
                            {loading ? 'Guardando...' : 'Guardar Días de Trabajo'}
                        </button>
                    </div>
                )}

                {activeTab === 'exceptions' && (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-900">Excepciones de Horario</h3>

                        {/* Add New Exception */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 mb-4">Agregar Nueva Excepción</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-xs text-gray-600 mb-1">Fecha</label>
                                    <input
                                        type="date"
                                        value={newException.date}
                                        onChange={(e) => setNewException({ ...newException, date: e.target.value })}
                                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-amber-500 focus:border-transparent bg-white text-gray-900"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-600 mb-1">Hora Inicio</label>
                                    <input
                                        type="time"
                                        value={newException.startTime}
                                        onChange={(e) => setNewException({ ...newException, startTime: e.target.value })}
                                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-amber-500 focus:border-transparent bg-white text-gray-900"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-600 mb-1">Hora Fin</label>
                                    <input
                                        type="time"
                                        value={newException.endTime}
                                        onChange={(e) => setNewException({ ...newException, endTime: e.target.value })}
                                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-amber-500 focus:border-transparent bg-white text-gray-900"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-600 mb-1">Motivo</label>
                                    <input
                                        type="text"
                                        value={newException.reason}
                                        onChange={(e) => setNewException({ ...newException, reason: e.target.value })}
                                        placeholder="Ej: Vacaciones, Mantenimiento"
                                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-amber-500 focus:border-transparent bg-white text-gray-900"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-3 mt-4">
                                <input
                                    type="checkbox"
                                    checked={newException.isActive}
                                    onChange={(e) => setNewException({ ...newException, isActive: e.target.checked })}
                                    className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                                />
                                <label className="text-sm text-gray-700">
                                    {newException.isActive ? 'Horario especial' : 'Día cerrado'}
                                </label>
                            </div>
                            <button
                                onClick={handleAddException}
                                className="mt-4 flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                Agregar Excepción
                            </button>
                        </div>

                        {/* Existing Exceptions */}
                        <div className="space-y-3">
                            {exceptions.map(exception => (
                                <div key={exception.id} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {new Date(exception.date).toLocaleDateString('es-ES', {
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    {exception.isActive
                                                        ? `${exception.startTime} - ${exception.endTime}`
                                                        : 'Cerrado'
                                                    }
                                                </p>
                                                <p className="text-sm text-gray-500">{exception.reason}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteException(exception.id)}
                                            className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {exceptions.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p>No hay excepciones de horario configuradas</p>
                            </div>
                        )}
                    </div>
                )}
            </motion.div>
        </div>
    )
}
