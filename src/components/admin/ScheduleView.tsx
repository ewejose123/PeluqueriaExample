// Schedule View Component
import { useState } from 'react'
import { Employee, Appointment, CalendarView, Service } from '@/types/admin'
import { getAppointmentsForDate, getEmployeeColor } from '@/lib/adminUtils'
import MobileMonthCalendarView from './MobileMonthCalendarView'
import WeekCalendarView from './WeekCalendarView'
import DayCalendarView from './DayCalendarView'
import AppointmentPopup from './AppointmentPopup'
import QuickAppointment from './QuickAppointment'
import { Plus } from 'lucide-react'

interface ScheduleViewProps {
    employees: Employee[]
    appointments: Appointment[]
    currentDate: Date
    setCurrentDate: (date: Date) => void
    selectedEmployee: string | null
    setSelectedEmployee: (employeeId: string | null) => void
    services: Service[] // You'll need to pass services from parent
}

export default function ScheduleView({
    employees,
    appointments,
    currentDate,
    setCurrentDate,
    selectedEmployee,
    setSelectedEmployee,
    services
}: ScheduleViewProps) {
    const [calendarView, setCalendarView] = useState<CalendarView>('month')
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
    const [showQuickAppointment, setShowQuickAppointment] = useState(false)

    const getAppointmentsForDateWrapper = (date: Date, employeeId?: string) => {
        return getAppointmentsForDate(appointments, date, employeeId)
    }

    const getEmployeeColorWrapper = (employeeId: string) => {
        return getEmployeeColor(employees, employeeId)
    }

    const handleAppointmentClick = (appointment: Appointment) => {
        setSelectedAppointment(appointment)
    }

    const handleDayClick = (date: Date) => {
        setCurrentDate(date)
        setCalendarView('day')
    }

    const handleAppointmentUpdate = (updatedAppointment: Appointment) => {
        // Update the appointment in the local state
        // In a real app, you'd want to refresh the data from the server
        window.location.reload() // Simple refresh for now
    }

    const handleAppointmentDelete = (appointmentId: string) => {
        // Remove the appointment from local state
        // In a real app, you'd want to refresh the data from the server
        window.location.reload() // Simple refresh for now
    }

    const handleQuickAppointmentSuccess = () => {
        // Refresh the appointments
        window.location.reload() // Simple refresh for now
    }

    return (
        <div className="space-y-6 transition-all duration-300">
            {/* Calendar View Controls */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900">Vista de Horarios</h2>

                    {/* Calendar View Toggle */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="flex bg-gray-100 rounded-lg p-1 w-full sm:w-auto">
                            <button
                                onClick={() => setCalendarView('month')}
                                className={`flex-1 sm:flex-none px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${calendarView === 'month'
                                    ? 'bg-white text-amber-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                Mes
                            </button>
                            <button
                                onClick={() => setCalendarView('week')}
                                className={`flex-1 sm:flex-none px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${calendarView === 'week'
                                    ? 'bg-white text-amber-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                Semana
                            </button>
                            <button
                                onClick={() => setCalendarView('day')}
                                className={`flex-1 sm:flex-none px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${calendarView === 'day'
                                    ? 'bg-white text-amber-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                Día
                            </button>
                        </div>

                        {/* Employee Filter */}
                        <select
                            value={selectedEmployee || ''}
                            onChange={(e) => setSelectedEmployee(e.target.value || null)}
                            className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white text-gray-900 font-medium transition-all duration-200 hover:border-gray-400"
                        >
                            <option value="">Todos los empleados</option>
                            {employees.map((emp) => (
                                <option key={emp.id} value={emp.id}>{emp.name}</option>
                            ))}
                        </select>

                        {/* Quick Add Button */}
                        <button
                            onClick={() => setShowQuickAppointment(true)}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                            <Plus className="w-4 h-4" />
                            Nueva Cita
                        </button>
                    </div>
                </div>
            </div>

            {/* Calendar Views */}
            {calendarView === 'month' ? (
                <MobileMonthCalendarView
                    currentDate={currentDate}
                    setCurrentDate={setCurrentDate}
                    appointments={appointments}
                    selectedEmployee={selectedEmployee}
                    getAppointmentsForDate={getAppointmentsForDateWrapper}
                    getEmployeeColor={getEmployeeColorWrapper}
                    employees={employees}
                    onAppointmentClick={handleAppointmentClick}
                    onDayClick={handleDayClick}
                />
            ) : calendarView === 'week' ? (
                <WeekCalendarView
                    currentDate={currentDate}
                    setCurrentDate={setCurrentDate}
                    appointments={appointments}
                    selectedEmployee={selectedEmployee}
                    getEmployeeColor={getEmployeeColorWrapper}
                    employees={employees}
                    onAppointmentClick={handleAppointmentClick}
                />
            ) : (
                <DayCalendarView
                    currentDate={currentDate}
                    setCurrentDate={setCurrentDate}
                    appointments={appointments}
                    selectedEmployee={selectedEmployee}
                    getEmployeeColor={getEmployeeColorWrapper}
                    employees={employees}
                    onAppointmentClick={handleAppointmentClick}
                />
            )}

            {/* Appointment Popup */}
            <AppointmentPopup
                appointment={selectedAppointment}
                employees={employees}
                services={services}
                onClose={() => setSelectedAppointment(null)}
                onUpdate={handleAppointmentUpdate}
                onDelete={handleAppointmentDelete}
            />

            {/* Quick Appointment Creation */}
            <QuickAppointment
                isOpen={showQuickAppointment}
                onClose={() => setShowQuickAppointment(false)}
                onSuccess={handleQuickAppointmentSuccess}
                employees={employees}
                services={services}
                selectedDate={currentDate}
            />
        </div>
    )
}