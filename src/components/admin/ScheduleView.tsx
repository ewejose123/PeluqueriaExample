// Schedule View Component
import { useState } from 'react'
import { Employee, Appointment, CalendarView } from '@/types/admin'
import { getAppointmentsForDate, getEmployeeColor } from '@/lib/adminUtils'
import MonthCalendarView from './MonthCalendarView'
import WeekCalendarView from './WeekCalendarView'

interface ScheduleViewProps {
    employees: Employee[]
    appointments: Appointment[]
    currentDate: Date
    setCurrentDate: (date: Date) => void
    selectedEmployee: string | null
    setSelectedEmployee: (employeeId: string | null) => void
}

export default function ScheduleView({
    employees,
    appointments,
    currentDate,
    setCurrentDate,
    selectedEmployee,
    setSelectedEmployee
}: ScheduleViewProps) {
    const [calendarView, setCalendarView] = useState<CalendarView>('month')

    const getAppointmentsForDateWrapper = (date: Date, employeeId?: string) => {
        return getAppointmentsForDate(appointments, date, employeeId)
    }

    const getEmployeeColorWrapper = (employeeId: string) => {
        return getEmployeeColor(employees, employeeId)
    }

    return (
        <div className="space-y-6">
            {/* Calendar View Controls */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900">Vista de Horarios</h2>

                    {/* Calendar View Toggle */}
                    <div className="flex items-center gap-4">
                        <div className="flex bg-gray-100 rounded-lg p-1">
                            <button
                                onClick={() => setCalendarView('month')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${calendarView === 'month'
                                        ? 'bg-white text-amber-600 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                Mes
                            </button>
                            <button
                                onClick={() => setCalendarView('week')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${calendarView === 'week'
                                        ? 'bg-white text-amber-600 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                Semana
                            </button>
                        </div>

                        {/* Employee Filter */}
                        <select
                            value={selectedEmployee || ''}
                            onChange={(e) => setSelectedEmployee(e.target.value || null)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white text-gray-900 font-medium"
                        >
                            <option value="">Todos los empleados</option>
                            {employees.map((emp) => (
                                <option key={emp.id} value={emp.id}>{emp.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Calendar Views */}
            {calendarView === 'month' ? (
                <MonthCalendarView
                    currentDate={currentDate}
                    setCurrentDate={setCurrentDate}
                    appointments={appointments}
                    selectedEmployee={selectedEmployee}
                    getAppointmentsForDate={getAppointmentsForDateWrapper}
                    getEmployeeColor={getEmployeeColorWrapper}
                    employees={employees}
                />
            ) : (
                <WeekCalendarView
                    currentDate={currentDate}
                    setCurrentDate={setCurrentDate}
                    appointments={appointments}
                    selectedEmployee={selectedEmployee}
                    getEmployeeColor={getEmployeeColorWrapper}
                    employees={employees}
                />
            )}
        </div>
    )
}
