'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, User, Euro, CheckCircle, X, AlertCircle } from 'lucide-react'
import StickyServiceBanner from './StickyServiceBanner'

interface Service {
    id: string
    name: string
    description: string | null
    duration: number
    price: number | null
    imageUrl: string | null
    category: string | null
}

interface ServiceSelectorProps {
    businessSlug?: string
    onServicesSelect: (services: Service[]) => void
}

export default function ServiceSelector({ businessSlug = 'sample-business', onServicesSelect }: ServiceSelectorProps) {
    const [services, setServices] = useState<Service[]>([])
    const [selectedServices, setSelectedServices] = useState<Service[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchServices()
    }, [businessSlug])

    const fetchServices = async () => {
        try {
            setLoading(true)
            const response = await fetch(`/api/services?businessSlug=${businessSlug}`)
            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch services')
            }

            setServices(data.services)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred')
        } finally {
            setLoading(false)
        }
    }

    const toggleService = (service: Service) => {
        setSelectedServices(prev => {
            const isSelected = prev.some(s => s.id === service.id)
            if (isSelected) {
                return prev.filter(s => s.id !== service.id)
            } else {
                return [...prev, service]
            }
        })
    }

    const handleContinue = () => {
        if (selectedServices.length > 0) {
            // Scroll to top of page first
            window.scrollTo({ top: 0, behavior: 'smooth' })
            // Then proceed with the next step after a small delay
            setTimeout(() => {
                onServicesSelect(selectedServices)
            }, 100)
        }
    }

    const handleRemoveService = (serviceId: string) => {
        setSelectedServices(prev => prev.filter(s => s.id !== serviceId))
    }

    const totalDuration = selectedServices.reduce((sum, service) => sum + service.duration, 0)
    const totalPrice = selectedServices.reduce((sum, service) => sum + (service.price || 0), 0)

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
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar servicios</h3>
                <p className="text-red-500 mb-4">{error}</p>
                <p className="text-gray-600 text-sm mb-4">
                    Por favor, inténtalo de nuevo. Si el problema persiste, llámanos al <strong>+34 123 456 789</strong> para hacer tu reserva por teléfono.
                </p>
                <button
                    onClick={fetchServices}
                    className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                >
                    Reintentar
                </button>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto px-4 pb-24">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-8"
            >
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Selecciona Servicios
                </h2>
                <p className="text-gray-600">
                    Puedes seleccionar múltiples servicios para tu cita
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service, index) => {
                    const isSelected = selectedServices.some(s => s.id === service.id)
                    return (
                        <motion.div
                            key={service.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group border-2 ${isSelected ? 'border-amber-500 bg-amber-50' : 'border-transparent hover:border-amber-500'
                                }`}
                            onClick={() => toggleService(service)}
                        >
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-5 h-5 text-amber-500" />
                                        <span className="text-sm text-gray-600">
                                            {service.duration} min
                                        </span>
                                    </div>
                                    {service.price && (
                                        <div className="flex items-center gap-1">
                                            <Euro className="w-4 h-4 text-green-600" />
                                            <span className="font-semibold text-green-600">
                                                {service.price}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <h3 className={`text-xl font-semibold mb-2 transition-colors ${isSelected ? 'text-amber-700' : 'text-gray-900 group-hover:text-amber-600'
                                    }`}>
                                    {service.name}
                                </h3>

                                {service.description && (
                                    <p className="text-gray-600 mb-4 line-clamp-3">
                                        {service.description}
                                    </p>
                                )}

                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500">
                                        {service.category || 'Servicio'}
                                    </span>
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected
                                        ? 'border-amber-500 bg-amber-500'
                                        : 'border-gray-300 group-hover:border-amber-500'
                                        }`}>
                                        {isSelected && <CheckCircle className="w-4 h-4 text-white" />}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )
                })}
            </div>

            {services.length === 0 && (
                <div className="text-center py-12">
                    <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No hay servicios disponibles</p>
                </div>
            )}

            {/* Selected Services Summary */}
            {selectedServices.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mt-8 bg-white rounded-xl shadow-lg p-6"
                >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Resumen de Servicios Seleccionados
                    </h3>

                    <div className="space-y-3 mb-6">
                        {selectedServices.map((service) => (
                            <div key={service.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex-1">
                                    <h4 className="font-medium text-gray-900">{service.name}</h4>
                                    <p className="text-sm text-gray-600">{service.duration} minutos</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-900">€{service.price}</p>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveService(service.id)}
                                        className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                                    >
                                        <X className="w-4 h-4 text-gray-500 hover:text-red-500" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="border-t pt-4">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-lg font-semibold text-gray-900">Total:</span>
                            <div className="text-right">
                                <p className="text-lg font-bold text-gray-900">{totalDuration} minutos</p>
                                <p className="text-lg font-bold text-green-600">€{totalPrice.toFixed(2)}</p>
                            </div>
                        </div>

                        <button
                            onClick={handleContinue}
                            className="w-full bg-amber-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-amber-600 transition-colors"
                        >
                            Continuar ({selectedServices.length} servicio{selectedServices.length !== 1 ? 's' : ''})
                        </button>
                    </div>
                </motion.div>
            )}

            {/* Sticky Banner */}
            <StickyServiceBanner
                selectedServices={selectedServices}
                onContinue={handleContinue}
            />
        </div>
    )
}
