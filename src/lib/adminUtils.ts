// Utility functions for admin panel
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns'
import { Employee, Appointment } from '@/types/admin'

export const generateCalendarDays = (currentDate: Date) => {
    const start = startOfMonth(currentDate)
    const end = endOfMonth(currentDate)
    return eachDayOfInterval({ start, end })
}

export const getAppointmentsForDate = (appointments: Appointment[], date: Date, employeeId?: string) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return appointments.filter(apt => {
        const aptDate = format(new Date(apt.startTime), 'yyyy-MM-dd')
        return aptDate === dateStr && (!employeeId || apt.employee.id === employeeId)
    })
}

export const getEmployeeColor = (employees: Employee[], employeeId: string) => {
    const colors = [
        'bg-blue-100 text-blue-800 border-blue-200',
        'bg-green-100 text-green-800 border-green-200',
        'bg-purple-100 text-purple-800 border-purple-200',
        'bg-pink-100 text-pink-800 border-pink-200',
        'bg-indigo-100 text-indigo-800 border-indigo-200',
        'bg-yellow-100 text-yellow-800 border-yellow-200',
        'bg-red-100 text-red-800 border-red-200',
        'bg-teal-100 text-teal-800 border-teal-200'
    ]
    const index = employees.findIndex(emp => emp.id === employeeId)
    return colors[index % colors.length] || 'bg-gray-100 text-gray-800 border-gray-200'
}

export const handleDeleteAppointment = async (appointmentId: string) => {
    if (confirm('¿Estás seguro de que quieres cancelar esta cita?')) {
        try {
            const response = await fetch(`/api/appointments?id=${appointmentId}&businessSlug=sample-business`, {
                method: 'DELETE'
            })
            if (response.ok) {
                window.location.reload()
            }
        } catch (error) {
            console.error('Error deleting appointment:', error)
        }
    }
}
