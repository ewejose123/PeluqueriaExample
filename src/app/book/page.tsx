'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Calendar, Clock, User } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import ServiceSelector from '@/components/booking/ServiceSelector'
import EmployeeSelector from '@/components/booking/EmployeeSelector'
import TimeSlotSelector from '@/components/booking/TimeSlotSelector'
import BookingForm from '@/components/booking/BookingForm'

type BookingStep = 'service' | 'employee' | 'time' | 'form' | 'success'

interface Service {
    id: string
    name: string
    description: string | null
    duration: number
    price: number | null
    imageUrl: string | null
    category: string | null
}

interface TimeSlot {
    time: string
    datetime: string
    employeeId: string
    employeeName: string
    serviceId: string
    serviceName: string
    duration: number
    price: number | null
}

export default function BookingPage() {
    const [currentStep, setCurrentStep] = useState<BookingStep>('service')
    const [selectedServices, setSelectedServices] = useState<Service[]>([]) // Changed to array
    const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null) // null = any available
    const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
    const [appointment, setAppointment] = useState<any>(null)

    const handleServicesSelect = (services: Service[]) => {
        setSelectedServices(services)
        setCurrentStep('employee')
    }

    const handleEmployeeSelect = (employeeId: string | null) => {
        setSelectedEmployee(employeeId)
        setCurrentStep('time')
    }

    const handleTimeSlotSelect = (slot: TimeSlot) => {
        setSelectedSlot(slot)
        setCurrentStep('form')
    }

    const handleBookingSuccess = (newAppointment: any) => {
        setAppointment(newAppointment)
        setCurrentStep('success')
    }

    const handleBack = () => {
        switch (currentStep) {
            case 'employee':
                setCurrentStep('service')
                break
            case 'time':
                setCurrentStep('employee')
                break
            case 'form':
                setCurrentStep('time')
                break
            default:
                break
        }
    }

    const resetBooking = () => {
        setCurrentStep('service')
        setSelectedServices([])
        setSelectedEmployee(null)
        setSelectedSlot(null)
        setAppointment(null)
    }

    return (
        <div className="min-h-screen">
            <Navigation />
            <main className="pt-16">
                <div className="bg-gray-50 py-8">
                    <div className="max-w-6xl mx-auto px-4">
                        {/* Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-center mb-12"
                        >
                            <h1 className="text-4xl font-bold text-gray-900 mb-4">
                                Reserva tu Cita
                            </h1>
                            <p className="text-gray-600 text-lg">
                                Reserva tu cita de forma rápida y sencilla
                            </p>
                        </motion.div>

                        {/* Progress Steps */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="flex justify-center mb-12"
                        >
                            <div className="flex items-center space-x-1 overflow-x-auto pb-2">
                                <button
                                    onClick={() => setCurrentStep('service')}
                                    className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs whitespace-nowrap transition-colors ${currentStep === 'service' ? 'bg-amber-500 text-white' :
                                        ['employee', 'time', 'form', 'success'].includes(currentStep) ? 'bg-green-500 text-white hover:bg-green-600' :
                                            'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                        }`}>
                                    <Calendar className="w-3 h-3" />
                                    <span className="font-medium">Servicio</span>
                                </button>

                                <div className={`w-4 h-0.5 flex-shrink-0 ${['employee', 'time', 'form', 'success'].includes(currentStep) ? 'bg-green-500' : 'bg-gray-200'
                                    }`} />

                                <button
                                    onClick={() => ['employee', 'time', 'form', 'success'].includes(currentStep) && setCurrentStep('employee')}
                                    disabled={!['employee', 'time', 'form', 'success'].includes(currentStep)}
                                    className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs whitespace-nowrap transition-colors ${currentStep === 'employee' ? 'bg-amber-500 text-white' :
                                        ['time', 'form', 'success'].includes(currentStep) ? 'bg-green-500 text-white hover:bg-green-600' :
                                            'bg-gray-200 text-gray-600'
                                        } ${!['employee', 'time', 'form', 'success'].includes(currentStep) ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                                    <User className="w-3 h-3" />
                                    <span className="font-medium">Profesional</span>
                                </button>

                                <div className={`w-4 h-0.5 flex-shrink-0 ${['time', 'form', 'success'].includes(currentStep) ? 'bg-green-500' : 'bg-gray-200'
                                    }`} />

                                <button
                                    onClick={() => ['time', 'form', 'success'].includes(currentStep) && setCurrentStep('time')}
                                    disabled={!['time', 'form', 'success'].includes(currentStep)}
                                    className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs whitespace-nowrap transition-colors ${currentStep === 'time' ? 'bg-amber-500 text-white' :
                                        ['form', 'success'].includes(currentStep) ? 'bg-green-500 text-white hover:bg-green-600' :
                                            'bg-gray-200 text-gray-600'
                                        } ${!['time', 'form', 'success'].includes(currentStep) ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                                    <Clock className="w-3 h-3" />
                                    <span className="font-medium">Horario</span>
                                </button>

                                <div className={`w-4 h-0.5 flex-shrink-0 ${['form', 'success'].includes(currentStep) ? 'bg-green-500' : 'bg-gray-200'
                                    }`} />

                                <button
                                    onClick={() => ['form', 'success'].includes(currentStep) && setCurrentStep('form')}
                                    disabled={!['form', 'success'].includes(currentStep)}
                                    className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs whitespace-nowrap transition-colors ${currentStep === 'form' ? 'bg-amber-500 text-white' :
                                        currentStep === 'success' ? 'bg-green-500 text-white hover:bg-green-600' :
                                            'bg-gray-200 text-gray-600'
                                        } ${!['form', 'success'].includes(currentStep) ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                                    <CheckCircle className="w-3 h-3" />
                                    <span className="font-medium">Confirmar</span>
                                </button>
                            </div>
                        </motion.div>

                        {/* Content */}
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            {currentStep === 'service' && (
                                <ServiceSelector onServicesSelect={handleServicesSelect} />
                            )}

                            {currentStep === 'employee' && selectedServices.length > 0 && (
                                <EmployeeSelector
                                    services={selectedServices}
                                    onEmployeeSelect={handleEmployeeSelect}
                                    onBack={handleBack}
                                />
                            )}

                            {currentStep === 'time' && selectedServices.length > 0 && (
                                <TimeSlotSelector
                                    services={selectedServices}
                                    selectedEmployee={selectedEmployee}
                                    onTimeSlotSelect={handleTimeSlotSelect}
                                    onBack={handleBack}
                                />
                            )}

                            {currentStep === 'form' && selectedSlot && (
                                <BookingForm
                                    slot={selectedSlot}
                                    onBack={handleBack}
                                    onSuccess={handleBookingSuccess}
                                />
                            )}

                            {currentStep === 'success' && appointment && (
                                <div className="max-w-2xl mx-auto text-center">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ duration: 0.5, type: 'spring' }}
                                        className="mb-8"
                                    >
                                        <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
                                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                            ¡Cita Confirmada!
                                        </h2>
                                        <p className="text-gray-600 text-lg mb-8">
                                            Tu cita ha sido reservada exitosamente
                                        </p>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: 0.2 }}
                                        className="bg-white rounded-xl shadow-lg p-8 mb-8"
                                    >
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-700">Servicio:</span>
                                                <span className="font-semibold text-gray-900">{appointment.service.name}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-700">Fecha:</span>
                                                <span className="font-semibold text-gray-900">
                                                    {format(new Date(appointment.startTime), 'EEEE, dd MMMM yyyy', { locale: es })}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-700">Hora:</span>
                                                <span className="font-semibold text-gray-900">
                                                    {format(new Date(appointment.startTime), 'HH:mm')} - {format(new Date(appointment.endTime), 'HH:mm')}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-700">Profesional:</span>
                                                <span className="font-semibold text-gray-900">{appointment.employee.name}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-700">Cliente:</span>
                                                <span className="font-semibold text-gray-900">{appointment.clientName}</span>
                                            </div>
                                        </div>
                                    </motion.div>

                                    <div className="space-x-4">
                                        <button
                                            onClick={resetBooking}
                                            className="px-6 py-3 bg-amber-500 text-white rounded-lg font-semibold hover:bg-amber-600 transition-colors"
                                        >
                                            Reservar Otra Cita
                                        </button>
                                        <button
                                            onClick={() => window.location.href = '/'}
                                            className="px-6 py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                                        >
                                            Volver al Inicio
                                        </button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
