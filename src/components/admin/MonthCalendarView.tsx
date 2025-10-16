// Month Calendar View Component
import { addDays, format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns'
import { es } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { Appointment, Employee } from '@/types/admin'
import { handleDeleteAppointment } from '@/lib/adminUtils'

interface MonthCalendarViewProps {
    currentDate: Date
    setCurrentDate: (date: Date) => void
    appointments: Appointment[]
    selectedEmployee: string | null
    getAppointmentsForDate: (date: Date, employeeId?: string) => Appointment[]
    getEmployeeColor: (employeeId: string) => string
    employees: Employee[]
}

export default function MonthCalendarView({
    currentDate,
    setCurrentDate,
    selectedEmployee,
    getAppointmentsForDate,
    getEmployeeColor
}: MonthCalendarViewProps) {
    const generateCalendarDays = () => {
        const start = startOfMonth(currentDate)
        const end = endOfMonth(currentDate)
        return eachDayOfInterval({ start, end })
    }

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            {/* Calendar Navigation */}
            <div className="flex items-center justify-between mb-8">
                <button
                    onClick={() => setCurrentDate(addDays(currentDate, -30))}
                    className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors border border-gray-300"
                >
                    <ChevronLeft className="w-6 h-6 text-gray-700" />
                </button>

                <h3 className="text-2xl font-bold text-gray-800">
                    {format(currentDate, 'MMMM yyyy', { locale: es })}
                </h3>

                <button
                    onClick={() => setCurrentDate(addDays(currentDate, 30))}
                    className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors border border-gray-300"
                >
                    <ChevronRight className="w-6 h-6 text-gray-700" />
                </button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-3 mb-4">
                {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
                    <div key={day} className="p-3 text-center font-semibold text-gray-600 text-sm bg-gray-50 rounded-lg">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-3">
                {generateCalendarDays().map((date) => {
                    const dayAppointments = getAppointmentsForDate(date, selectedEmployee || undefined)
                    const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')

                    return (
                        <div
                            key={date.toISOString()}
                            className={`min-h-[120px] p-3 border-2 rounded-xl bg-white text-gray-900 transition-all duration-200 hover:shadow-md ${isToday ? 'border-amber-400 bg-amber-50' : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <div className={`text-sm font-bold mb-2 ${isToday ? 'text-amber-700' : 'text-gray-700'}`}>
                                {format(date, 'd')}
                            </div>
                            <div className="space-y-1">
                                {dayAppointments.slice(0, 3).map((apt) => (
                                    <div
                                        key={apt.id}
                                        className={`text-xs p-2 rounded-lg border truncate group relative ${getEmployeeColor(apt.employee.id)}`}
                                        title={`${apt.clientName} - ${apt.service.name}`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium">{format(new Date(apt.startTime), 'HH:mm')}</span>
                                            <span className="truncate ml-1">{apt.clientName}</span>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteAppointment(apt.id)}
                                            className="opacity-0 group-hover:opacity-100 text-red-600 hover:text-red-800 ml-1 absolute top-1 right-1"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                                {dayAppointments.length > 3 && (
                                    <div className="text-xs text-gray-500 text-center py-1">
                                        +{dayAppointments.length - 3} más
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
