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
        <section id="services" className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        Nuestros <span className="text-amber-500">Servicios</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Ofrecemos una amplia gama de servicios profesionales diseñados para satisfacer
                        todas tus necesidades de estilo y cuidado personal.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <motion.div
                            key={service.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
                        >
                            <div className="relative overflow-hidden">
                                <img
                                    src={service.image}
                                    alt={service.name}
                                    className="w-full h-64 object-cover transition-transform duration-700 ease-out will-change-transform"
                                    style={{
                                        transform: 'scale(1)',
                                        transition: 'transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'scale(1.1)'
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'scale(1)'
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                <div className="absolute bottom-4 left-4 right-4">
                                    <h3 className="text-white text-xl font-bold mb-2">{service.name}</h3>
                                    <div className="flex items-center gap-4 text-white/90 text-sm">
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            {service.duration} min
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Euro className="w-4 h-4" />
                                            {service.price}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6">
                                <p className="text-gray-600 mb-4">{service.description}</p>
                                <a
                                    href={`/book?service=${service.id}`}
                                    className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold py-3 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2"
                                >
                                    <Scissors className="w-4 h-4" />
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
