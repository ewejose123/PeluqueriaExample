'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, User, ArrowLeft, CheckCircle, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react'
import { format, addDays, startOfDay, isToday, isTomorrow, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns'
import { es } from 'date-fns/locale'
import CalendarPopup from './CalendarPopup'

interface TimeSlot {
    time: string
    datetime: string
    employeeId: string
    employeeName: string
    serviceId: string
    serviceName: string
    duration: number
    price: number | null
}

interface TimeSlotSelectorProps {
    services: {
        id: string
        name: string
        duration: number
        price: number | null
    }[]
    selectedEmployee?: string | null // null = any available
    businessSlug?: string
    onTimeSlotSelect: (slot: TimeSlot) => void
    onBack: () => void
}

export default function TimeSlotSelector({
    services,
    selectedEmployee = null,
    businessSlug = 'sample-business',
    onTimeSlotSelect,
    onBack
}: TimeSlotSelectorProps) {
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [showCalendar, setShowCalendar] = useState(false)
    const [currentMonth, setCurrentMonth] = useState(new Date())
    const [bookingSettings, setBookingSettings] = useState<any>(null)
    const calendarRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        fetchTimeSlots()
    }, [selectedDate, services])

    useEffect(() => {
        fetchBookingSettings()
    }, [])

    const fetchBookingSettings = async () => {
        try {
            const response = await fetch(`/api/booking-settings?businessSlug=${businessSlug}`)
            const data = await response.json()
            if (response.ok) {
                setBookingSettings(data.settings)
            }
        } catch (error) {
            console.error('Error fetching booking settings:', error)
        }
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
                setShowCalendar(false)
            }
        }

        if (showCalendar) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [showCalendar])

    const fetchTimeSlots = async () => {
        try {
            setLoading(true)
            setError(null)

            const dateStr = format(selectedDate, 'yyyy-MM-dd')

            // Calculate total duration for all services
            const totalDuration = services.reduce((sum, service) => sum + service.duration, 0)

            // Use the first service for the API call, but we'll need to update the API to handle multiple services
            let url = `/api/availability?serviceId=${services[0].id}&date=${dateStr}&businessSlug=${businessSlug}&totalDuration=${totalDuration}`

            // Add employee filter if specific employee is selected
            if (selectedEmployee) {
                url += `&employeeId=${selectedEmployee}`
            }

            const response = await fetch(url)
            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch time slots')
            }

            setTimeSlots(data.availableSlots)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred')
        } finally {
            setLoading(false)
        }
    }

    const generateDateOptions = () => {
        const dates = []
        const today = new Date()
        const maxAdvanceDays = bookingSettings?.maxAdvanceDays || 90
        const maxDate = addDays(today, maxAdvanceDays)

        // Generate dates for the current month view
        const monthStart = startOfMonth(currentMonth)
        const monthEnd = endOfMonth(currentMonth)

        // Add dates from the current month
        for (let i = 0; i < monthEnd.getDate(); i++) {
            const date = addDays(monthStart, i)
            if (date >= today && date <= maxDate) { // Only show future dates within limit
                dates.push(date)
            }
        }

        // If we're viewing a future month, add some dates from next month too
        if (currentMonth > today) {
            const nextMonth = addMonths(currentMonth, 1)
            const nextMonthStart = startOfMonth(nextMonth)
            for (let i = 0; i < 7; i++) { // Add first 7 days of next month
                const date = addDays(nextMonthStart, i)
                if (date <= maxDate) {
                    dates.push(date)
                }
            }
        }

        return dates.slice(0, 14) // Limit to 14 days
    }

    const formatDateLabel = (date: Date) => {
        if (isToday(date)) return 'Hoy'
        if (isTomorrow(date)) return 'Mañana'
        return format(date, 'dd MMM', { locale: es })
    }

    const groupSlotsByTime = (slots: TimeSlot[]) => {
        const grouped: { [key: string]: TimeSlot[] } = {}

        slots.forEach(slot => {
            if (!grouped[slot.time]) {
                grouped[slot.time] = []
            }
            grouped[slot.time].push(slot)
        })

        return grouped
    }

    const groupedSlots = groupSlotsByTime(timeSlots)

    return (
        <div className="max-w-4xl mx-auto px-4">
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
                    <span>Volver a servicios</span>
                </button>

                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {services.map(s => s.name).join(' + ')}
                    </h2>
                    <div className="flex items-center gap-4 text-gray-600">
                        <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{services.reduce((sum, s) => sum + s.duration, 0)} minutos</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span>€{services.reduce((sum, s) => sum + (s.price || 0), 0).toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Date Selector */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mb-8"
            >
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Selecciona una fecha
                    </h3>
                    <button
                        onClick={() => setShowCalendar(!showCalendar)}
                        className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg transition-colors"
                    >
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">Calendario</span>
                    </button>
                </div>

                {/* Month Header with Navigation */}
                <div className="flex items-center justify-between mb-4">
                    <button
                        onClick={() => {
                            const newMonth = subMonths(currentMonth, 1)
                            const today = new Date()
                            if (newMonth >= startOfMonth(today)) {
                                setCurrentMonth(newMonth)
                                // Set selected date to first available date of the new month
                                const firstDate = startOfMonth(newMonth)
                                if (firstDate >= today) {
                                    setSelectedDate(firstDate)
                                }
                            }
                        }}
                        disabled={currentMonth <= startOfMonth(new Date())}
                        className={`p-2 rounded-lg transition-colors ${currentMonth <= startOfMonth(new Date())
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'
                            }`}
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    <h4 className="text-xl font-semibold text-gray-800">
                        {format(currentMonth, 'MMMM yyyy', { locale: es })}
                    </h4>

                    <button
                        onClick={() => {
                            const newMonth = addMonths(currentMonth, 1)
                            const maxAdvanceDays = bookingSettings?.maxAdvanceDays || 90
                            const maxDate = addDays(new Date(), maxAdvanceDays)
                            if (newMonth <= startOfMonth(maxDate)) {
                                setCurrentMonth(newMonth)
                                // Set selected date to first available date of the new month
                                const firstDate = startOfMonth(newMonth)
                                if (firstDate >= new Date()) {
                                    setSelectedDate(firstDate)
                                }
                            }
                        }}
                        disabled={currentMonth >= startOfMonth(addDays(new Date(), bookingSettings?.maxAdvanceDays || 90))}
                        className={`p-2 rounded-lg transition-colors ${currentMonth >= startOfMonth(addDays(new Date(), bookingSettings?.maxAdvanceDays || 90))
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'
                            }`}
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>

                {/* Calendar Popup */}
                {showCalendar && (
                    <motion.div
                        ref={calendarRef}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute z-10 bg-white rounded-xl shadow-xl border p-4 mt-2"
                    >
                        <CalendarPopup
                            selectedDate={selectedDate}
                            onDateSelect={(date) => {
                                setSelectedDate(date)
                                setCurrentMonth(startOfMonth(date)) // Update current month when date is selected
                                setShowCalendar(false)
                            }}
                            maxAdvanceDays={bookingSettings?.maxAdvanceDays}
                        />
                    </motion.div>
                )}

                {/* Date Pills */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {generateDateOptions().map((date) => (
                        <button
                            key={date.toISOString()}
                            onClick={() => setSelectedDate(date)}
                            className={`px-3 py-2 rounded-lg whitespace-nowrap transition-colors min-w-[50px] ${selectedDate.toDateString() === date.toDateString()
                                ? 'bg-amber-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            <div className="text-center">
                                <div className="text-lg font-bold">
                                    {format(date, 'd')}
                                </div>
                                <div className="text-xs">
                                    {format(date, 'EEE', { locale: es })}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* Time Slots */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Horarios disponibles
                </h3>

                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
                    </div>
                ) : error ? (
                    <div className="text-center py-12">
                        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar horarios</h3>
                        <p className="text-red-500 mb-4">{error}</p>
                        <p className="text-gray-600 text-sm mb-4">
                            Por favor, inténtalo de nuevo. Si el problema persiste, llámanos al <strong>+34 123 456 789</strong> para hacer tu reserva por teléfono.
                        </p>
                        <button
                            onClick={fetchTimeSlots}
                            className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                        >
                            Intentar de nuevo
                        </button>
                    </div>
                ) : Object.keys(groupedSlots).length === 0 ? (
                    <div className="text-center py-12">
                        <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">
                            No hay horarios disponibles para esta fecha
                        </p>
                        <p className="text-gray-400 text-sm mt-2">
                            Prueba seleccionando otra fecha
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                        {Object.entries(groupedSlots)
                            .sort(([a], [b]) => a.localeCompare(b))
                            .map(([time, slots]) => (
                                <button
                                    key={time}
                                    onClick={() => onTimeSlotSelect(slots[0])} // Take first available slot
                                    className="p-3 bg-white border border-gray-200 rounded-lg hover:border-amber-500 hover:bg-amber-50 transition-all duration-200 group text-center"
                                >
                                    <div className="text-sm font-medium text-gray-700 group-hover:text-amber-700">
                                        {time}
                                    </div>
                                    <div className="text-xs text-gray-500 group-hover:text-amber-600 mt-1">
                                        {slots.length} disponible{slots.length !== 1 ? 's' : ''}
                                    </div>
                                </button>
                            ))}
                    </div>
                )}
            </motion.div>
        </div>
    )
}
