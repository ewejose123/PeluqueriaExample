// Mobile-Optimized Month Calendar View Component
import { addDays, format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns'
import { es } from 'date-fns/locale'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Appointment, Employee } from '@/types/admin'
import { getEmployeeColor } from '@/lib/adminUtils'

interface MobileMonthCalendarViewProps {
    currentDate: Date
    setCurrentDate: (date: Date) => void
    appointments: Appointment[]
    selectedEmployee: string | null
    getAppointmentsForDate: (date: Date, employeeId?: string) => Appointment[]
    getEmployeeColor: (employeeId: string) => string
    employees: Employee[]
    onAppointmentClick: (appointment: Appointment) => void
    onDayClick?: (date: Date) => void
}

export default function MobileMonthCalendarView({
    currentDate,
    setCurrentDate,
    appointments,
    selectedEmployee,
    getAppointmentsForDate,
    getEmployeeColor,
    employees,
    onAppointmentClick,
    onDayClick
}: MobileMonthCalendarViewProps) {
    const generateCalendarDays = () => {
        const start = startOfMonth(currentDate)
        const end = endOfMonth(currentDate)
        const allDays = eachDayOfInterval({ start, end })

        // Filter out Sundays (day 0)
        return allDays.filter(day => day.getDay() !== 0)
    }


    return (
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
            {/* Calendar Navigation */}
            <div className="flex items-center justify-between mb-6">
                <button
                    onClick={() => setCurrentDate(addDays(currentDate, -30))}
                    className="p-2 md:p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors border border-gray-300"
                >
                    <ChevronLeft className="w-4 h-4 md:w-6 md:h-6 text-gray-700" />
                </button>

                <h3 className="text-lg md:text-2xl font-bold text-gray-800">
                    {format(currentDate, 'MMMM yyyy', { locale: es })}
                </h3>

                <button
                    onClick={() => setCurrentDate(addDays(currentDate, 30))}
                    className="p-2 md:p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors border border-gray-300"
                >
                    <ChevronRight className="w-4 h-4 md:w-6 md:h-6 text-gray-700" />
                </button>
            </div>

            {/* Calendar Grid - Mobile Optimized */}
            <div className="grid grid-cols-6 gap-2 mb-4">
                {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
                    <div key={day} className="p-2 text-center font-semibold text-gray-600 text-xs md:text-sm bg-gray-50 rounded-lg">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-6 gap-2">
                {generateCalendarDays().map((date) => {
                    const dayAppointments = getAppointmentsForDate(date, selectedEmployee || undefined)
                    const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')

                    return (
                        <div
                            key={date.toISOString()}
                            className={`min-h-[60px] md:min-h-[80px] p-2 border-2 rounded-xl transition-all duration-200 hover:shadow-md ${isToday ? 'border-amber-400 bg-amber-50' : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <div
                                className={`text-xs md:text-sm font-bold mb-1 cursor-pointer ${isToday ? 'text-amber-700' : 'text-gray-700'}`}
                                onClick={() => onDayClick?.(date)}
                            >
                                {format(date, 'd')}
                            </div>

                            {/* Show numbered appointment boxes */}
                            <div className="grid grid-cols-2 gap-1">
                                {dayAppointments.slice(0, 6).map((apt, index) => (
                                    <div
                                        key={apt.id}
                                        className={`w-full h-4 md:h-5 rounded-md border cursor-pointer flex items-center justify-center text-xs font-bold transition-all duration-200 hover:scale-105 ${getEmployeeColor(apt.employee.id)}`}
                                        title={`${apt.clientName} - ${apt.service.name} (${format(new Date(apt.startTime), 'HH:mm')})`}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            onAppointmentClick(apt)
                                        }}
                                    >
                                        {index + 1}
                                    </div>
                                ))}
                                {dayAppointments.length > 6 && (
                                    <div className="col-span-2 text-xs text-gray-500 text-center">
                                        +{dayAppointments.length - 6}
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
