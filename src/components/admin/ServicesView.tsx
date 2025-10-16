// Services View Component
import { useState } from 'react'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { Service } from '@/types/admin'

interface ServicesViewProps {
    services: Service[]
    onUpdate: () => void
}

export default function ServicesView({ services }: ServicesViewProps) {

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Gestión de Servicios</h2>
                <button
                    onClick={() => {/* TODO: Implement add service */ }}
                    className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Nuevo Servicio
                </button>
            </div>

            <div className="grid gap-4">
                {services.map((service) => (
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
                                    onClick={() => {/* TODO: Implement edit service */ }}
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
