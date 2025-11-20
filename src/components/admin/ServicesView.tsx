// Services View Component
import { useState } from 'react'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { Service } from '@/types/admin'
import ServiceModal from './ServiceModal'

interface ServicesViewProps {
    services: Service[]
    onUpdate: () => void
}

export default function ServicesView({ services, onUpdate }: ServicesViewProps) {
    const [selectedService, setSelectedService] = useState<Service | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const handleEditService = (service: Service) => {
        setSelectedService(service)
        setIsModalOpen(true)
    }

    const handleAddService = () => {
        setSelectedService(null)
        setIsModalOpen(true)
    }

    const handleDeleteService = async (serviceId: string) => {
        if (confirm('¿Estás seguro de que quieres eliminar este servicio?')) {
            try {
                const response = await fetch(`/api/services/${serviceId}?businessSlug=sample-business`, {
                    method: 'DELETE'
                })
                if (response.ok) {
                    onUpdate()
                }
            } catch (error) {
                console.error('Error deleting service:', error)
            }
        }
    }

    const handleSaveService = async (serviceData: Partial<Service>) => {
        try {
            const url = selectedService
                ? `/api/services/${selectedService.id}?businessSlug=sample-business`
                : '/api/services?businessSlug=sample-business'

            const method = selectedService ? 'PUT' : 'POST'

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(serviceData),
            })

            if (response.ok) {
                onUpdate()
                setIsModalOpen(false)
            } else {
                throw new Error('Failed to save service')
            }
        } catch (error) {
            console.error('Error saving service:', error)
            throw error
        }
    }

    return (
        <>
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900">Gestión de Servicios</h2>
                    <button
                        onClick={handleAddService}
                        className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Nuevo Servicio
                    </button>
                </div>

                <div className="grid gap-4">
                    {services.map((service) => (
                        <div key={service.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold text-gray-900">{service.name}</h3>
                                    <p className="text-sm text-gray-600">
                                        Duración: {service.duration} minutos | Precio: €{service.price}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleEditService(service)}
                                        className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteService(service.id)}
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

            <ServiceModal
                service={selectedService}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveService}
            />
        </>
    )
}
