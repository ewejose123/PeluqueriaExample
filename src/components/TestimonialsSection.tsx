'use client'

import { motion, useAnimationFrame } from 'framer-motion'
import { Star } from 'lucide-react'
import { useRef } from 'react'

const reviews = [
    { name: 'Carlos M.', text: 'Servicio impecable. El mejor corte que me he hecho en años.', date: '2024-06-12' },
    { name: 'Lucía R.', text: 'Detalles cuidados y trato excelente. Totalmente recomendado.', date: '2024-07-03' },
    { name: 'Javier P.', text: 'Profesionales y puntuales. Ambiente top. Volveré seguro.', date: '2024-08-15' },
    { name: 'Marina G.', text: 'Me encantó el arreglo de barba. Muy precisos y atentos.', date: '2024-09-21' },
    { name: 'Diego S.', text: 'Calidad-precio inmejorable. Estilo moderno y limpio.', date: '2024-10-01' },
]

function Stars() {
    return (
        <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 text-amber-500 fill-amber-500" />
            ))}
        </div>
    )
}

function InfiniteRow({ direction = 1, speed = 30 }: { direction?: 1 | -1; speed?: number }) {
    const baseX = useRef(0) // px position accumulator
    const containerRef = useRef<HTMLDivElement>(null)

    useAnimationFrame((t, delta) => {
        if (!containerRef.current) return
        const width = containerRef.current.scrollWidth / 2
        baseX.current += (speed * direction * delta) / 1000 // px per second
        if (direction === 1 && baseX.current >= width) baseX.current -= width
        if (direction === -1 && baseX.current <= -width) baseX.current += width
        containerRef.current.style.transform = `translate3d(${baseX.current * -1}px,0,0)`
    })

    const items = [...reviews, ...reviews] // duplicate for seamless loop

    return (
        <div className="overflow-hidden">
            <div ref={containerRef} className="flex gap-4 will-change-transform">
                {items.map((r, idx) => (
                    <div
                        key={`${r.name}-${idx}`}
                        className="min-w-[320px] max-w-[360px] bg-white rounded-xl shadow-md p-5 border border-gray-100"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <Stars />
                            <span className="text-xs text-gray-400">{new Date(r.date).toLocaleDateString('es-ES')}</span>
                        </div>
                        <p className="text-gray-700 mb-3">{r.text}</p>
                        <p className="text-sm font-semibold text-gray-900">{r.name}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default function TestimonialsSection() {
    return (
        <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Opiniones de Clientes</h2>
                    <p className="text-gray-600 text-lg">5 estrellas en cada visita. Calidad que se nota.</p>
                </motion.div>

                <InfiniteRow direction={1} speed={40} />
            </div>
        </section>
    )
}


