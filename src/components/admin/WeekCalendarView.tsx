// Week Calendar View Component - Continuous Timeline
import { addDays, format, startOfWeek, endOfWeek, startOfDay, endOfDay } from 'date-fns'
import { es } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, User } from 'lucide-react'
import { Appointment, Employee } from '@/types/admin'

interface WeekCalendarViewProps {
    currentDate: Date
    setCurrentDate: (date: Date) => void
    appointments: Appointment[]
    selectedEmployee: string | null
    getEmployeeColor: (employeeId: string) => string
    employees: Employee[]
    onAppointmentClick?: (appointment: Appointment) => void
}

export default function WeekCalendarView({
    currentDate,
    setCurrentDate,
    appointments,
    selectedEmployee,
    getEmployeeColor,
    employees,
    onAppointmentClick
}: WeekCalendarViewProps) {
    const generateWeekDays = () => {
        const start = new Date(currentDate)
        start.setDate(currentDate.getDate() - currentDate.getDay())
        const weekDays = Array.from({ length: 7 }, (_, i) => {
            const day = new Date(start)
            day.setDate(start.getDate() + i)
            return day
        })

        // Filter out Sundays (day 0) - return only Monday to Saturday
        return weekDays.filter(day => day.getDay() !== 0)
    }

    // Generate hour markers (8 AM to 8 PM)
    const generateHourMarkers = () => {
        const hours = []
        for (let hour = 8; hour <= 20; hour++) {
            hours.push(hour)
        }
        return hours
    }

    // Get appointments for the current week grouped by professional
    const getWeekAppointmentsByProfessional = () => {
        const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }) // Monday
        const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 }) // Sunday

        const weekAppointments = appointments.filter(apt => {
            if (selectedEmployee && apt.employee.id !== selectedEmployee) return false

            const aptDate = new Date(apt.startTime)
            return aptDate >= weekStart && aptDate <= weekEnd
        })

        // Group appointments by professional
        const appointmentsByProfessional = new Map<string, Appointment[]>()

        weekAppointments.forEach(apt => {
            const professionalId = apt.employee.id
            if (!appointmentsByProfessional.has(professionalId)) {
                appointmentsByProfessional.set(professionalId, [])
            }
            appointmentsByProfessional.get(professionalId)!.push(apt)
        })

        return appointmentsByProfessional
    }

    // Calculate appointment position and height for a specific day
    const getAppointmentStyle = (appointment: Appointment, dayDate: Date, professionalIndex: number, totalProfessionals: number) => {
        const start = new Date(appointment.startTime)
        const end = new Date(appointment.endTime)

        // Only show appointments that start on this specific day
        if (start.toDateString() !== dayDate.toDateString()) {
            return { display: 'none' }
        }

        // Calculate position from 8 AM (hour 8)
        const startHour = start.getHours() + start.getMinutes() / 60
        const endHour = end.getHours() + end.getMinutes() / 60

        // Position relative to 8 AM (0 = 8 AM, 1 = 9 AM, etc.)
        const topPosition = (startHour - 8) * 100 // 100px per hour for more space
        const height = (endHour - startHour) * 100 // Height based on duration

        // Calculate column width and position
        const columnWidth = 100 / totalProfessionals
        const leftPosition = professionalIndex * columnWidth
        const rightMargin = 1 // Small margin between columns

        return {
            top: `${topPosition}px`,
            height: `${height}px`,
            left: `${leftPosition}%`,
            width: `calc(${columnWidth}% - ${rightMargin}px)`,
            minHeight: '28px' // Increased minimum height for better text visibility
        }
    }

    const weekDays = generateWeekDays()
    const hourMarkers = generateHourMarkers()
    const appointmentsByProfessional = getWeekAppointmentsByProfessional()
    const professionalIds = Array.from(appointmentsByProfessional.keys())
    const totalProfessionals = Math.max(professionalIds.length, 1) // At least 1 column

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300">
            {/* Week Navigation */}
            <div className="flex items-center justify-between mb-8">
                <button
                    onClick={() => setCurrentDate(addDays(currentDate, -7))}
                    className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-200 border border-gray-300 hover:shadow-md"
                >
                    <ChevronLeft className="w-6 h-6 text-gray-700" />
                </button>

                <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-800 transition-colors duration-200">
                        {format(weekDays[0], 'dd MMM', { locale: es })} - {format(weekDays[weekDays.length - 1], 'dd MMM yyyy', { locale: es })}
                    </h3>
                    <p className="text-sm text-gray-600">Semana</p>
                </div>

                <button
                    onClick={() => setCurrentDate(addDays(currentDate, 7))}
                    className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-200 border border-gray-300 hover:shadow-md"
                >
                    <ChevronRight className="w-6 h-6 text-gray-700" />
                </button>
            </div>

            {/* Professional Legend */}
            {professionalIds.length > 0 && (
                <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Profesionales</h4>
                    <div className="flex flex-wrap gap-3">
                        {professionalIds.map((professionalId) => {
                            const professional = employees.find(emp => emp.id === professionalId)
                            const professionalAppointments = appointmentsByProfessional.get(professionalId) || []
                            return (
                                <div key={professionalId} className="flex items-center gap-2">
                                    <div
                                        className={`w-4 h-4 rounded-full ${getEmployeeColor(professionalId)}`}
                                    />
                                    <span className="text-sm font-medium text-gray-700">
                                        {professional?.name || 'Profesional'}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        ({professionalAppointments.length} citas)
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Week Timeline */}
            <div className="relative overflow-x-auto">
                <div className="min-w-[800px]">
                    {/* Timeline Container */}
                    <div className="flex">
                        {/* Time Labels */}
                        <div className="w-20 flex-shrink-0">
                            {hourMarkers.map(hour => (
                                <div
                                    key={hour}
                                    className="h-15 border-b border-gray-200 flex items-center justify-end pr-2 transition-colors duration-200"
                                    style={{ height: '100px' }}
                                >
                                    <span className="text-sm font-medium text-gray-600">
                                        {hour.toString().padStart(2, '0')}:00
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Days */}
                        {weekDays.map(day => (
                            <div key={day.toISOString()} className="flex-1 relative border border-gray-200 border-l-0 rounded-r-lg overflow-hidden">
                                {/* Day Header */}
                                <div className="h-12 border-b border-gray-200 bg-gray-50 flex items-center justify-center transition-colors duration-200">
                                    <div className="text-center">
                                        <div className="text-sm font-semibold text-gray-800">
                                            {format(day, 'EEE', { locale: es })}
                                        </div>
                                        <div className="text-xs text-gray-600">
                                            {format(day, 'dd', { locale: es })}
                                        </div>
                                    </div>
                                </div>

                                {/* Day Timeline */}
                                <div className="relative bg-white" style={{ height: `${hourMarkers.length * 100}px` }}>
                                    {/* Hour Grid Lines */}
                                    {hourMarkers.map(hour => (
                                        <div
                                            key={hour}
                                            className="absolute w-full border-b border-gray-100 transition-colors duration-200"
                                            style={{
                                                top: `${(hour - 8) * 100}px`,
                                                height: '1px'
                                            }}
                                        />
                                    ))}

                                    {/* Half-hour reference lines */}
                                    {hourMarkers.slice(0, -1).map(hour => (
                                        <div
                                            key={`${hour}-30`}
                                            className="absolute w-full border-b border-gray-50 transition-colors duration-200"
                                            style={{
                                                top: `${(hour - 8) * 100 + 50}px`,
                                                height: '1px'
                                            }}
                                        />
                                    ))}

                                    {/* Professional Columns for this day */}
                                    {professionalIds.map((professionalId, professionalIndex) => {
                                        const professionalAppointments = appointmentsByProfessional.get(professionalId) || []
                                        const dayAppointments = professionalAppointments.filter(apt => {
                                            const aptDate = new Date(apt.startTime)
                                            return aptDate.toDateString() === day.toDateString()
                                        })

                                        return (
                                            <div key={professionalId}>
                                                {dayAppointments.map(appointment => {
                                                    const style = getAppointmentStyle(appointment, day, professionalIndex, totalProfessionals)
                                                    const duration = Math.round((new Date(appointment.endTime).getTime() - new Date(appointment.startTime).getTime()) / (1000 * 60))
                                                    const height = (new Date(appointment.endTime).getTime() - new Date(appointment.startTime).getTime()) / (1000 * 60 * 60) * 100 // Convert to pixels

                                                    return (
                                                        <div
                                                            key={appointment.id}
                                                            className={`absolute cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02] ${getEmployeeColor(appointment.employee.id)} rounded-lg border`}
                                                            style={style}
                                                            onClick={() => onAppointmentClick?.(appointment)}
                                                        >
                                                            <div className="p-1 h-full flex flex-col justify-between">
                                                                <div className="flex items-center gap-1">
                                                                    <User className="w-2 h-2 flex-shrink-0" />
                                                                    <div className="text-xs font-semibold truncate">
                                                                        {appointment.clientName}
                                                                    </div>
                                                                </div>
                                                                {height >= 40 && (
                                                                    <div className="text-xs truncate opacity-90">
                                                                        {appointment.service.name}
                                                                    </div>
                                                                )}
                                                                {height >= 60 && (
                                                                    <div className="text-xs opacity-80">
                                                                        {format(new Date(appointment.startTime), 'HH:mm')}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}