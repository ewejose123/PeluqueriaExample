// Employees View Component
import { useState } from 'react'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { Employee, Service } from '@/types/admin'

interface EmployeesViewProps {
    employees: Employee[]
    services: Service[]
    onUpdate: () => void
}

export default function EmployeesView({ employees, onUpdate }: EmployeesViewProps) {

    const handleDeleteEmployee = async (employeeId: string) => {
        if (confirm('¿Estás seguro de que quieres eliminar este empleado?')) {
            try {
                const response = await fetch(`/api/employees/${employeeId}?businessSlug=sample-business`, {
                    method: 'DELETE'
                })
                if (response.ok) {
                    onUpdate()
                }
            } catch (error) {
                console.error('Error deleting employee:', error)
            }
        }
    }

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Gestión de Empleados</h2>
                <button
                    onClick={() => {/* TODO: Implement add employee */ }}
                    className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Nuevo Empleado
                </button>
            </div>

            <div className="grid gap-4">
                {employees.map((employee) => (
                    <div key={employee.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                                    {employee.avatarUrl ? (
                                        <img
                                            src={employee.avatarUrl}
                                            alt={employee.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600 font-semibold">
                                            {employee.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">{employee.name}</h3>
                                    <p className="text-sm text-gray-600">{employee.email}</p>
                                    <p className="text-sm text-gray-600">
                                        Servicios: {employee.services.map(s => s.name).join(', ')}
                                    </p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className={`px-2 py-1 rounded-full text-xs ${employee.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                            {employee.isActive ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => {/* TODO: Implement edit employee */ }}
                                    className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDeleteEmployee(employee.id)}
                                    className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
