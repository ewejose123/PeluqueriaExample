// Summary View Component
import { Appointment, Employee, Service } from '@/types/admin'
import { Calendar, Users, Settings, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface SummaryViewProps {
    appointments: Appointment[]
    employees: Employee[]
    services: Service[]
    onAppointmentClick?: (appointment: Appointment) => void
}

export default function SummaryView({ appointments, employees, services, onAppointmentClick }: SummaryViewProps) {
    const todaysAppointments = appointments.filter((apt) => {
        const aptDate = new Date(apt.startTime)
        const today = new Date()
        return aptDate.toDateString() === today.toDateString()
    })

    const weeklyAppointments = appointments.filter((apt) => {
        const aptDate = new Date(apt.startTime)
        const now = new Date()
        const weekStart = new Date(now)
        weekStart.setDate(now.getDate() - now.getDay())
        weekStart.setHours(0, 0, 0, 0)
        const weekEnd = new Date(weekStart)
        weekEnd.setDate(weekEnd.getDate() + 6)
        weekEnd.setHours(23, 59, 59, 999)
        return aptDate >= weekStart && aptDate <= weekEnd
    })

    const activeEmployees = employees.filter((emp) => emp.isActive)

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Calendar className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Citas Hoy</p>
                            <p className="text-2xl font-bold text-gray-900">{todaysAppointments.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <Users className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Empleados Activos</p>
                            <p className="text-2xl font-bold text-gray-900">{activeEmployees.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <Settings className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Servicios</p>
                            <p className="text-2xl font-bold text-gray-900">{services.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-amber-100 rounded-lg">
                            <Clock className="w-6 h-6 text-amber-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Citas Esta Semana</p>
                            <p className="text-2xl font-bold text-gray-900">{weeklyAppointments.length}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Appointments */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Citas Recientes</h3>
                <div className="space-y-3">
                    {appointments.slice(0, 5).reverse().map((apt) => (
                        <div
                            key={apt.id}
                            className={`flex items-center justify-between p-3 rounded-lg transition-colors duration-200 ${onAppointmentClick ? 'bg-gray-50 hover:bg-gray-100 cursor-pointer' : 'bg-gray-50'}`}
                            onClick={() => onAppointmentClick?.(apt)}
                        >
                            <div>
                                <p className="font-medium text-gray-900">{apt.clientName}</p>
                                <p className="text-sm text-gray-600">{apt.service.name} - {apt.employee.name}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">
                                    {format(new Date(apt.startTime), 'dd/MM HH:mm')}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {format(new Date(apt.startTime), 'EEEE', { locale: es })}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
