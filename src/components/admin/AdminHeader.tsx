// Admin Header Component
import { Employee, Appointment } from '@/types/admin'

interface AdminHeaderProps {
    appointments: Appointment[]
    employees: Employee[]
}

export default function AdminHeader({ appointments, employees }: AdminHeaderProps) {
    return (
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold text-white">Panel de Administración</h1>
                        <p className="text-amber-100 mt-2 text-lg">Gestiona horarios, empleados y configuraciones</p>
                    </div>
                    <div className="hidden md:flex items-center space-x-4">
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                            <p className="text-white text-sm font-medium">
                                {appointments.length} citas totales
                            </p>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                            <p className="text-white text-sm font-medium">
                                {employees.filter(emp => emp.isActive).length} empleados activos
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
