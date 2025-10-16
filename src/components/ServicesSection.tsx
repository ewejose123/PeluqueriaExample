'use client'

import { motion } from 'framer-motion'
import { Scissors, Clock, Euro } from 'lucide-react'

const services = [
    {
        id: 1,
        name: 'Corte Clásico',
        description: 'El corte tradicional que nunca pasa de moda. Perfecto para cualquier ocasión.',
        duration: 30,
        price: 15,
        image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
        id: 2,
        name: 'Corte Moderno',
        description: 'Estilos contemporáneos y tendencias actuales para un look fresco y actualizado.',
        duration: 45,
        price: 20,
        image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
        id: 3,
        name: 'Barba Completa',
        description: 'Arreglo y perfilado completo de barba con técnicas profesionales.',
        duration: 30,
        price: 12,
        image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
        id: 4,
        name: 'Corte + Barba',
        description: 'Combo completo: corte de pelo y arreglo de barba en una sola sesión.',
        duration: 60,
        price: 25,
        image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
        id: 5,
        name: 'Tratamiento Capilar',
        description: 'Cuidado especializado para el cabello con productos de alta calidad.',
        duration: 45,
        price: 18,
        image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
        id: 6,
        name: 'Servicio Premium',
        description: 'Experiencia completa con corte, barba, tratamiento y masaje relajante.',
        duration: 90,
        price: 35,
        image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    }
]

export default function ServicesSection() {
    return (
        <section id="services" className="py-12 sm:py-16 md:py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-12 sm:mb-16"
                >
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
                        Nuestros <span className="text-amber-500">Servicios</span>
                    </h2>
                    <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-2">
                        Ofrecemos una amplia gama de servicios profesionales diseñados para satisfacer
                        todas tus necesidades de estilo y cuidado personal.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {services.map((service, index) => (
                        <motion.div
                            key={service.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer"
                        >
                            <div className="relative overflow-hidden">
                                <img
                                    src={service.image}
                                    alt={service.name}
                                    className="w-full h-48 sm:h-56 md:h-64 object-cover transition-all duration-500 ease-out will-change-transform group-hover:scale-110 group-hover:brightness-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-100 group-hover:opacity-90 transition-opacity duration-300" />
                                <div className="absolute inset-0 bg-amber-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">
                                    <h3 className="text-white text-lg sm:text-xl font-bold mb-1 sm:mb-2">{service.name}</h3>
                                    <div className="flex items-center gap-3 sm:gap-4 text-white/90 text-xs sm:text-sm">
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                                            {service.duration} min
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Euro className="w-3 h-3 sm:w-4 sm:h-4" />
                                            {service.price}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 sm:p-6">
                                <p className="text-gray-600 mb-4 text-sm sm:text-base">{service.description}</p>
                                <a
                                    href={`/book?service=${service.id}`}
                                    className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold py-2 sm:py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base hover:shadow-md"
                                >
                                    <Scissors className="w-3 h-3 sm:w-4 sm:h-4" />
                                    Reservar Ahora
                                </a>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
