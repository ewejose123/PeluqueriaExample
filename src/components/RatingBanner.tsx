'use client'

import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

export default function RatingBanner() {
    return (
        <section className="py-8 bg-gradient-to-r from-amber-500 to-amber-600">
            <div className="max-w-7xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center text-white"
                >
                    <div className="flex items-center justify-center gap-3">
                        <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className="w-5 h-5 fill-white" />
                            ))}
                        </div>
                        <span className="text-lg md:text-xl font-semibold">
                            Promedio de 5 Estrellas
                        </span>
                        <span className="text-amber-100 text-sm md:text-base">
                            • Más de 30 reseñas verificadas
                        </span>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
