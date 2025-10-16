'use client'

import { motion } from 'framer-motion'
import { Clock, Euro, ArrowRight } from 'lucide-react'

interface Service {
    id: string
    name: string
    description: string | null
    duration: number
    price: number | null
    imageUrl: string | null
    category: string | null
}

interface StickyServiceBannerProps {
    selectedServices: Service[]
    onContinue: () => void
}

export default function StickyServiceBanner({
    selectedServices,
    onContinue
}: StickyServiceBannerProps) {
    if (selectedServices.length === 0) return null

    const totalDuration = selectedServices.reduce((sum, service) => sum + service.duration, 0)
    const totalPrice = selectedServices.reduce((sum, service) => sum + (service.price || 0), 0)

    return (
        <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg"
        >
            <div className="max-w-7xl mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Service Count */}
                    <div className="flex items-center gap-4">
                        <span className="text-lg font-semibold text-gray-900">
                            {selectedServices.length} servicio{selectedServices.length !== 1 ? 's' : ''}
                        </span>

                        <div className="flex items-center gap-1 text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span className="font-medium">{totalDuration} min</span>
                        </div>

                        <div className="flex items-center gap-1 text-green-600">
                            <Euro className="w-4 h-4" />
                            <span className="font-bold text-lg">{totalPrice.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Continue Button */}
                    <button
                        onClick={onContinue}
                        className="flex items-center gap-2 bg-amber-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-600 transition-colors"
                    >
                        <span>Continuar</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </motion.div>
    )
}
