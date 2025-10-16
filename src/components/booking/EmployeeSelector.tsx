'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, User, Users, CheckCircle, AlertCircle } from 'lucide-react'

interface Service {
    id: string
    name: string
    description: string | null
    duration: number
    price: number | null
    imageUrl: string | null
    category: string | null
}

interface Employee {
    id: string
    name: string
    email: string | null
    phone: string | null
    avatarUrl: string | null
}

interface EmployeeSelectorProps {
    services: Service[]
    businessSlug?: string
    onEmployeeSelect: (employeeId: string | null) => void
    onBack: () => void
}

export default function EmployeeSelector({
    services,
    businessSlug = 'sample-business',
    onEmployeeSelect,
    onBack
}: EmployeeSelectorProps) {
    const [employees, setEmployees] = useState<Employee[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchEmployees()
    }, [services])

    const fetchEmployees = async () => {
        try {
            setLoading(true)
            const response = await fetch(`/api/services?businessSlug=${businessSlug}`)
            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch employees')
            }

            // Get employees who can perform ALL selected services
            const serviceIds = services.map(s => s.id)
            const allEmployees = new Set<string>()

            data.services.forEach((service: any) => {
                if (serviceIds.includes(service.id) && service.employees) {
                    service.employees.forEach((emp: any) => {
                        allEmployees.add(emp.id)
                    })
                }
            })

            // Filter employees who can perform all services
            const availableEmployees = data.services
                .filter((service: any) => serviceIds.includes(service.id))
                .flatMap((service: any) => service.employees || [])
                .filter((emp: any, index: number, arr: any[]) =>
                    arr.filter(e => e.id === emp.id).length === serviceIds.length
                )
                .reduce((acc: any[], emp: any) => {
                    if (!acc.find(e => e.id === emp.id)) {
                        acc.push(emp)
                    }
                    return acc
                }, [])

            setEmployees(availableEmployees)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred')
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar profesionales</h3>
                <p className="text-red-500 mb-4">{error}</p>
                <p className="text-gray-600 text-sm mb-4">
                    Por favor, inténtalo de nuevo. Si el problema persiste, llámanos al <strong>+34 123 456 789</strong> para hacer tu reserva por teléfono.
                </p>
                <button
                    onClick={fetchEmployees}
                    className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                >
                    Reintentar
                </button>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto px-4">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-8"
            >
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Volver a servicios</span>
                </button>

                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Selecciona un Profesional
                    </h2>
                    <p className="text-gray-600">
                        Elige quién realizará tus servicios: {services.map(s => s.name).join(', ')}
                    </p>
                </div>
            </motion.div>

            {/* Employee Options */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
                {/* Any Available Option */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group border-2 border-transparent hover:border-amber-500"
                    onClick={() => onEmployeeSelect(null)}
                >
                    <div className="p-6 text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                            <Users className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors">
                            Cualquier Disponible
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Te asignaremos el primer profesional disponible en el horario que elijas
                        </p>
                        <div className="flex items-center justify-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-500 group-hover:scale-110 transition-transform" />
                            <span className="text-sm text-gray-500">Más opciones de horarios</span>
                        </div>
                    </div>
                </motion.div>

                {/* Individual Employees */}
                {employees.map((employee, index) => (
                    <motion.div
                        key={employee.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group border-2 border-transparent hover:border-amber-500"
                        onClick={() => onEmployeeSelect(employee.id)}
                    >
                        <div className="p-6 text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                {employee.avatarUrl ? (
                                    <img
                                        src={employee.avatarUrl}
                                        alt={employee.name}
                                        className="w-16 h-16 rounded-full object-cover"
                                    />
                                ) : (
                                    <User className="w-8 h-8 text-white" />
                                )}
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors">
                                {employee.name}
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Profesional especializado en {services.map(s => s.name).join(', ')}
                            </p>
                            <div className="flex items-center justify-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-500 group-hover:scale-110 transition-transform" />
                                <span className="text-sm text-gray-500">Seleccionar</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {employees.length === 0 && (
                <div className="text-center py-12">
                    <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No hay profesionales disponibles</p>
                </div>
            )}
        </div>
    )
}
