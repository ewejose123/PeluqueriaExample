// Service Management Modal Component
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, Save, Settings, AlertCircle } from 'lucide-react'
import { Service } from '@/types/admin'

interface ServiceModalProps {
    service: Service | null
    isOpen: boolean
    onClose: () => void
    onSave: (serviceData: Partial<Service>) => Promise<void>
}

export default function ServiceModal({
    service,
    isOpen,
    onClose,
    onSave
}: ServiceModalProps) {

    const [formData, setFormData] = useState({
        name: '',
        duration: 30,
        price: 0
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Initialize form data when service changes
    useEffect(() => {
        if (service) {
            setFormData({
                name: service.name,
                duration: service.duration,
                price: service.price
            })
        } else {
            // Reset form for new service
            setFormData({
                name: '',
                duration: 30,
                price: 0
            })
        }
    }, [service])

    const handleSave = async () => {
        if (!formData.name.trim()) {
            setError('El nombre del servicio es obligatorio')
            return
        }

        if (formData.duration <= 0) {
            setError('La duración debe ser mayor a 0')
            return
        }

        if (formData.price < 0) {
            setError('El precio no puede ser negativo')
            return
        }

        setLoading(true)
        setError(null)

        try {
            await onSave(formData)
            onClose()
        } catch (error) {
            setError('Error al guardar el servicio')
            console.error('Error saving service:', error)
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Settings className="w-6 h-6" />
                            <h2 className="text-2xl font-bold">
                                {service ? 'Editar Servicio' : 'Nuevo Servicio'}
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-red-500" />
                            <p className="text-red-700">{error}</p>
                        </div>
                    )}

                    <div className="space-y-6">
                        {/* Service Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nombre del Servicio *
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white text-gray-900"
                                placeholder="Ej: Corte de cabello, Barba, etc."
                            />
                        </div>

                        {/* Duration and Price */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Duración (minutos) *
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={formData.duration}
                                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white text-gray-900"
                                    placeholder="30"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Precio (€) *
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white text-gray-900"
                                    placeholder="25.00"
                                />
                            </div>
                        </div>

                        {/* Service Preview */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="text-sm font-medium text-gray-700 mb-2">Vista previa:</h3>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-semibold text-gray-900">
                                        {formData.name || 'Nombre del servicio'}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {formData.duration} minutos
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-bold text-amber-600">
                                        {formData.price.toFixed(2)}€
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" />
                        {loading ? 'Guardando...' : 'Guardar'}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    )
}
