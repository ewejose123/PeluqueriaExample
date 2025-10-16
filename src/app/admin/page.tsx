'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    Calendar,
    Users,
    Settings,
    Clock,
    Plus,
    Edit,
    Trash2,
    Save,
    X,
    ChevronLeft,
    ChevronRight
} from 'lucide-react'
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns'
import { es } from 'date-fns/locale'

interface Employee {
    id: string
    name: string
    email?: string
    phone?: string
    isActive: boolean
    services: Service[]
    workingHours: WorkingHours[]
}

interface Service {
    id: string
    name: string
    duration: number
    price: number
}

interface WorkingHours {
    id: string
    dayOfWeek: number
    startTime: string
    endTime: string
    isActive: boolean
}

interface Appointment {
    id: string
    startTime: string
    endTime: string
    clientName: string
    clientEmail: string
    service: Service
    employee: Employee
}

interface BookingSettings {
    id: string
    advanceBookingDays: number
    minBookingHours: number
    maxBookingHours: number
    slotDuration: number
    bufferTime: number
    allowSameDay: boolean
    requireConfirmation: boolean
    cancellationHours: number
    maxAdvanceDays: number
    workingDays: Record<string, boolean>
    breakTimes?: Array<{ start: string; end: string }>
}

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<'schedule' | 'employees' | 'services' | 'settings' | 'summary'>('schedule')
    const [employees, setEmployees] = useState<Employee[]>([])
    const [services, setServices] = useState<Service[]>([])
    const [appointments, setAppointments] = useState<Appointment[]>([])
    const [bookingSettings, setBookingSettings] = useState<BookingSettings | null>(null)
    const [loading, setLoading] = useState(false)
    const [currentDate, setCurrentDate] = useState(new Date())
    const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null)
    const [calendarView, setCalendarView] = useState<'month' | 'week'>('month')

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        setLoading(true)
        try {
            const [employeesRes, servicesRes, appointmentsRes, settingsRes] = await Promise.all([
                fetch('/api/employees'),
                fetch('/api/services'),
                fetch('/api/appointments'),
                fetch('/api/booking-settings')
            ])

            if (employeesRes.ok) {
                const data = await employeesRes.json()
                setEmployees(data.employees || [])
            }

            if (servicesRes.ok) {
                const data = await servicesRes.json()
                setServices(data.services || [])
            }

            if (appointmentsRes.ok) {
                const data = await appointmentsRes.json()
                setAppointments(data.appointments || [])
            }

            if (settingsRes.ok) {
                const data = await settingsRes.json()
                setBookingSettings(data.settings)
            }
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setLoading(false)
        }
    }

    const updateBookingSettings = async (updates: Partial<BookingSettings>) => {
        try {
            const response = await fetch('/api/booking-settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates)
            })

            if (response.ok) {
                const data = await response.json()
                setBookingSettings(data.settings)
            }
        } catch (error) {
            console.error('Error updating settings:', error)
        }
    }

    const generateCalendarDays = () => {
        const start = startOfMonth(currentDate)
        const end = endOfMonth(currentDate)
        return eachDayOfInterval({ start, end })
    }

    const getAppointmentsForDate = (date: Date, employeeId?: string) => {
        const dateStr = format(date, 'yyyy-MM-dd')
        return appointments.filter(apt => {
            const aptDate = format(new Date(apt.startTime), 'yyyy-MM-dd')
            return aptDate === dateStr && (!employeeId || apt.employee.id === employeeId)
        })
    }

    const tabs = [
        { id: 'summary', label: 'Resumen', icon: Calendar },
        { id: 'schedule', label: 'Horarios', icon: Calendar },
        { id: 'employees', label: 'Empleados', icon: Users },
        { id: 'services', label: 'Servicios', icon: Settings },
        { id: 'settings', label: 'Configuración', icon: Clock }
    ]

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
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

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Tabs */}
                <div className="bg-white rounded-xl shadow-lg mb-8 overflow-hidden">
                    <div className="border-b border-gray-100">
                        <nav className="flex space-x-1 px-6 overflow-x-auto">
                            {tabs.map((tab) => {
                                const Icon = tab.icon
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as any)}
                                        className={`flex items-center gap-3 py-5 px-4 border-b-3 font-semibold text-sm transition-all duration-200 whitespace-nowrap ${activeTab === tab.id
                                            ? 'border-amber-500 text-amber-600 bg-amber-50'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span>{tab.label}</span>
                                    </button>
                                )
                            })}
                        </nav>
                    </div>
                </div>

                {/* Tab Content */}
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {activeTab === 'summary' && (
                        <SummaryView
                            appointments={appointments}
                            employees={employees}
                            services={services}
                        />
                    )}

                    {activeTab === 'schedule' && (
                        <ScheduleView
                            employees={employees}
                            appointments={appointments}
                            currentDate={currentDate}
                            setCurrentDate={setCurrentDate}
                            selectedEmployee={selectedEmployee}
                            setSelectedEmployee={setSelectedEmployee}
                            getAppointmentsForDate={getAppointmentsForDate}
                            calendarView={calendarView}
                            setCalendarView={setCalendarView}
                        />
                    )}

                    {activeTab === 'employees' && (
                        <EmployeesView
                            employees={employees}
                            services={services}
                            onUpdate={fetchData}
                        />
                    )}

                    {activeTab === 'services' && (
                        <ServicesView
                            services={services}
                            onUpdate={fetchData}
                        />
                    )}

                    {activeTab === 'settings' && (
                        <SettingsView
                            settings={bookingSettings}
                            onUpdate={updateBookingSettings}
                        />
                    )}
                </motion.div>
            </div>
        </div>
    )
}

// Schedule View Component
function ScheduleView({
    employees,
    appointments,
    currentDate,
    setCurrentDate,
    selectedEmployee,
    setSelectedEmployee,
    getAppointmentsForDate,
    calendarView,
    setCalendarView
}: any) {
    const generateCalendarDays = () => {
        const start = startOfMonth(currentDate)
        const end = endOfMonth(currentDate)
        return eachDayOfInterval({ start, end })
    }

    // Professional color system for employees
    const getEmployeeColor = (employeeId: string) => {
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

    const handleDeleteAppointment = async (appointmentId: string) => {
        if (confirm('¿Estás seguro de que quieres cancelar esta cita?')) {
            try {
                const response = await fetch(`/api/appointments?id=${appointmentId}`, {
                    method: 'DELETE'
                })
                if (response.ok) {
                    // Refresh appointments
                    window.location.reload()
                }
            } catch (error) {
                console.error('Error deleting appointment:', error)
            }
        }
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
                            {employees.map((emp: Employee) => (
                                <option key={emp.id} value={emp.id}>{emp.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div> {/* <-- FIX: The missing closing div was added here */}

            {/* Calendar Views */}
            {calendarView === 'month' ? (
                <MonthCalendarView
                    currentDate={currentDate}
                    setCurrentDate={setCurrentDate}
                    appointments={appointments}
                    selectedEmployee={selectedEmployee}
                    getAppointmentsForDate={getAppointmentsForDate}
                    getEmployeeColor={getEmployeeColor}
                    employees={employees}
                />
            ) : (
                <WeekCalendarView
                    currentDate={currentDate}
                    setCurrentDate={setCurrentDate}
                    appointments={appointments}
                    selectedEmployee={selectedEmployee}
                    getEmployeeColor={getEmployeeColor}
                    employees={employees}
                />
            )}
        </div>
    )
} // <-- FIX: The missing closing brace for the ScheduleView function was added here.

// Month Calendar View Component
function MonthCalendarView({
    currentDate,
    setCurrentDate,
    appointments,
    selectedEmployee,
    getAppointmentsForDate,
    getEmployeeColor,
    employees
}: any) {
    const generateCalendarDays = () => {
        const start = startOfMonth(currentDate)
        const end = endOfMonth(currentDate)
        return eachDayOfInterval({ start, end })
    }

    const handleDeleteAppointment = async (appointmentId: string) => {
        if (confirm('¿Estás seguro de que quieres cancelar esta cita?')) {
            try {
                const response = await fetch(`/api/appointments?id=${appointmentId}`, {
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
                    const dayAppointments = getAppointmentsForDate(date, selectedEmployee)
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
                                {dayAppointments.slice(0, 3).map((apt: any) => (
                                    <div
                                        key={apt.id}
                                        className={`text-xs p-2 rounded-lg border truncate group relative ${getEmployeeColor(apt.employeeId)}`}
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

// Week Calendar View Component
function WeekCalendarView({
    currentDate,
    setCurrentDate,
    appointments,
    selectedEmployee,
    getEmployeeColor,
    employees
}: any) {
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

        return appointments.filter((apt: any) => {
            if (selectedEmployee && apt.employeeId !== selectedEmployee) return false

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
                                            {slotAppointments.map((apt: any) => (
                                                <div
                                                    key={apt.id}
                                                    className={`text-xs p-1 rounded border truncate ${getEmployeeColor(apt.employeeId)}`}
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

// Employees View Component
function EmployeesView({ employees, services, onUpdate }: any) {
    const [showForm, setShowForm] = useState(false)
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)

    const handleDeleteEmployee = async (employeeId: string) => {
        if (confirm('¿Estás seguro de que quieres eliminar este empleado?')) {
            try {
                const response = await fetch(`/api/employees/${employeeId}`, {
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
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Nuevo Empleado
                </button>
            </div>

            <div className="grid gap-4">
                {employees.map((employee: Employee) => (
                    <div key={employee.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
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
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setEditingEmployee(employee)}
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

// Services View Component
function ServicesView({ services, onUpdate }: any) {
    const [showForm, setShowForm] = useState(false)
    const [editingService, setEditingService] = useState<Service | null>(null)

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Gestión de Servicios</h2>
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Nuevo Servicio
                </button>
            </div>

            <div className="grid gap-4">
                {services.map((service: Service) => (
                    <div key={service.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-gray-900">{service.name}</h3>
                                <p className="text-sm text-gray-600">
                                    Duración: {service.duration} minutos | Precio: €{service.price}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setEditingService(service)}
                                    className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button className="p-2 text-gray-500 hover:text-red-600 transition-colors">
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

// Settings View Component
function SettingsView({ settings, onUpdate }: any) {
    const [formData, setFormData] = useState<Partial<BookingSettings>>({})

    useEffect(() => {
        if (settings) {
            setFormData(settings)
        }
    }, [settings])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onUpdate(formData)
    }

    if (!settings) return <div>Cargando configuración...</div>

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Configuración de Reservas</h2>

            {/* Help Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">¿Cómo funcionan estos ajustes?</h3>
                <div className="text-sm text-blue-800 space-y-2">
                    <p><strong>Duración de slots:</strong> Intervalo de tiempo entre cada horario disponible (ej: 30 min = horarios cada 30 minutos)</p>
                    <p><strong>Tiempo de buffer:</strong> Tiempo de descanso entre citas para preparación y limpieza</p>
                    <p><strong>Días máximos de anticipación:</strong> Cuántos días en el futuro pueden reservar los clientes</p>
                    <p><strong>Horas mínimas de anticipación:</strong> Tiempo mínimo antes de la cita para permitir reservas</p>
                    <p><strong>Requerir confirmación:</strong> Si está activado, las citas necesitan confirmación manual antes de ser válidas</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Días máximos de anticipación
                        </label>
                        <input
                            type="number"
                            value={formData.maxAdvanceDays || 90}
                            onChange={(e) => setFormData({ ...formData, maxAdvanceDays: parseInt(e.target.value) })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white text-gray-900"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Duración de slots (minutos)
                        </label>
                        <input
                            type="number"
                            value={formData.slotDuration || 30}
                            onChange={(e) => setFormData({ ...formData, slotDuration: parseInt(e.target.value) })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white text-gray-900"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tiempo de buffer (minutos)
                        </label>
                        <input
                            type="number"
                            value={formData.bufferTime || 15}
                            onChange={(e) => setFormData({ ...formData, bufferTime: parseInt(e.target.value) })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white text-gray-900"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Horas mínimas de anticipación
                        </label>
                        <input
                            type="number"
                            value={formData.minBookingHours || 2}
                            onChange={(e) => setFormData({ ...formData, minBookingHours: parseInt(e.target.value) })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white text-gray-900"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <label className="flex items-center text-gray-700">
                        <input
                            type="checkbox"
                            checked={formData.allowSameDay || false}
                            onChange={(e) => setFormData({ ...formData, allowSameDay: e.target.checked })}
                            className="mr-2"
                        />
                        Permitir reservas el mismo día
                    </label>

                    <label className="flex items-center text-gray-700">
                        <input
                            type="checkbox"
                            checked={formData.requireConfirmation || false}
                            onChange={(e) => setFormData({ ...formData, requireConfirmation: e.target.checked })}
                            className="mr-2"
                        />
                        Requerir confirmación
                    </label>
                </div>

                <button
                    type="submit"
                    className="flex items-center gap-2 bg-amber-500 text-white px-6 py-3 rounded-lg hover:bg-amber-600 transition-colors"
                >
                    <Save className="w-4 h-4" />
                    Guardar Configuración
                </button>
            </form>
        </div>
    )
}

// Summary View Component
function SummaryView({ appointments, employees, services }: any) {
    const todaysAppointments = appointments.filter((apt: any) => {
        const aptDate = new Date(apt.startTime)
        const today = new Date()
        return aptDate.toDateString() === today.toDateString()
    })

    const weeklyAppointments = appointments.filter((apt: any) => {
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

    const activeEmployees = employees.filter((emp: any) => emp.isActive)

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
                    {appointments.slice(0, 5).reverse().map((apt: any) => (
                        <div key={apt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
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