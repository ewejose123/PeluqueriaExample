// Week Calendar View Component
import { addDays, format } from 'date-fns'
import { es } from 'date-fns/locale'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Appointment, Employee } from '@/types/admin'

interface WeekCalendarViewProps {
    currentDate: Date
    setCurrentDate: (date: Date) => void
    appointments: Appointment[]
    selectedEmployee: string | null
    getEmployeeColor: (employeeId: string) => string
    employees: Employee[]
}

export default function WeekCalendarView({
    currentDate,
    setCurrentDate,
    appointments,
    selectedEmployee,
    getEmployeeColor
}: WeekCalendarViewProps) {
    const generateWeekDays = () => {
        const start = new Date(currentDate)
        start.setDate(currentDate.getDate() - currentDate.getDay())
        return Array.from({ length: 7 }, (_, i) => {
            const day = new Date(start)
            day.setDate(start.getDate() + i)
            return day
        })
    }

    const generateTimeSlots = () => {
        const slots = []
        for (let hour = 8; hour <= 20; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                slots.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`)
            }
        }
        return slots
    }

    const getAppointmentsForTimeSlot = (date: Date, timeSlot: string) => {
        const [hour, minute] = timeSlot.split(':').map(Number)
        const slotStart = new Date(date)
        slotStart.setHours(hour, minute, 0, 0)
        const slotEnd = new Date(slotStart)
        slotEnd.setMinutes(slotEnd.getMinutes() + 30)

        return appointments.filter((apt) => {
            if (selectedEmployee && apt.employee.id !== selectedEmployee) return false

            const aptStart = new Date(apt.startTime)
            const aptEnd = new Date(apt.endTime)

            return aptStart < slotEnd && aptEnd > slotStart
        })
    }

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            {/* Week Navigation */}
            <div className="flex items-center justify-between mb-8">
                <button
                    onClick={() => setCurrentDate(addDays(currentDate, -7))}
                    className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors border border-gray-300"
                >
                    <ChevronLeft className="w-6 h-6 text-gray-700" />
                </button>

                <h3 className="text-2xl font-bold text-gray-800">
                    {format(currentDate, 'dd MMMM yyyy', { locale: es })} - {format(addDays(currentDate, 6), 'dd MMMM yyyy', { locale: es })}
                </h3>

                <button
                    onClick={() => setCurrentDate(addDays(currentDate, 7))}
                    className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors border border-gray-300"
                >
                    <ChevronRight className="w-6 h-6 text-gray-700" />
                </button>
            </div>

            {/* Week Grid */}
            <div className="overflow-x-auto">
                <div className="min-w-[800px]">
                    {/* Header */}
                    <div className="grid grid-cols-8 gap-2 mb-4">
                        <div className="p-3 text-center font-semibold text-gray-600 text-sm bg-gray-50 rounded-lg">
                            Hora
                        </div>
                        {generateWeekDays().map((date) => (
                            <div key={date.toISOString()} className="p-3 text-center font-semibold text-gray-600 text-sm bg-gray-50 rounded-lg">
                                <div>{format(date, 'EEE', { locale: es })}</div>
                                <div className="text-lg font-bold">{format(date, 'd')}</div>
                            </div>
                        ))}
                    </div>

                    {/* Time Slots */}
                    <div className="space-y-1">
                        {generateTimeSlots().map((timeSlot) => (
                            <div key={timeSlot} className="grid grid-cols-8 gap-2">
                                <div className="p-2 text-center font-medium text-gray-600 text-sm bg-gray-50 rounded-lg flex items-center justify-center">
                                    {timeSlot}
                                </div>
                                {generateWeekDays().map((date) => {
                                    const slotAppointments = getAppointmentsForTimeSlot(date, timeSlot)
                                    return (
                                        <div key={`${date.toISOString()}-${timeSlot}`} className="min-h-[40px] p-1 border border-gray-200 rounded-lg bg-white">
                                            {slotAppointments.map((apt) => (
                                                <div
                                                    key={apt.id}
                                                    className={`text-xs p-1 rounded border truncate ${getEmployeeColor(apt.employee.id)}`}
                                                    title={`${apt.clientName} - ${apt.service.name}`}
                                                >
                                                    {format(new Date(apt.startTime), 'HH:mm')} {apt.clientName}
                                                </div>
                                            ))}
                                        </div>
                                    )
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
