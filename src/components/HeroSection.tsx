'use client'

import { motion } from 'framer-motion'
import { Calendar, MapPin, Phone } from 'lucide-react'

export default function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <div
                    className="w-full h-full bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: "url('https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80')"
                    }}
                />
                <div className="absolute inset-0 bg-black/50" />
            </div>

            {/* Content */}
            <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 md:mb-6 tracking-tight">
                        Barbería <span className="text-amber-400">Elite</span>
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 md:mb-8 text-gray-200 max-w-2xl mx-auto px-2">
                        Donde la tradición se encuentra con el estilo moderno.
                        Experimenta el mejor servicio de barbería en Totana.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-8 md:mb-12 px-2"
                >
                    <a
                        href="/book"
                        className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-black font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-full transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                        <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                        Reservar Cita
                    </a>
                    <a
                        href="#contact"
                        className="w-full sm:w-auto border-2 border-white text-white hover:bg-white hover:text-black font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-full transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                        <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                        Contactar
                    </a>
                </motion.div>

                {/* Quick Info Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="max-w-4xl mx-auto px-2"
                >
                    {/* Mobile Layout: 2 cards top row, 1 card centered bottom */}
                    <div className="block sm:hidden">
                        <div className="grid grid-cols-2 gap-3 mb-3">
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                                <MapPin className="w-5 h-5 mx-auto mb-2 text-amber-400" />
                                <h3 className="font-semibold mb-1 text-xs text-center">Ubicación</h3>
                                <p className="text-xs text-gray-300 text-center">
                                    Calle Sta. Eulalia, 8A<br />
                                    30850 Totana
                                </p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                                <Calendar className="w-5 h-5 mx-auto mb-2 text-amber-400" />
                                <h3 className="font-semibold mb-1 text-xs text-center">Horarios</h3>
                                <p className="text-xs text-gray-300 text-center">
                                    Lun - Vie: 9:00 - 19:00<br />
                                    Sáb: 9:00 - 17:00
                                </p>
                            </div>
                        </div>
                        <div className="flex justify-center">
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20 w-1/2">
                                <Phone className="w-5 h-5 mx-auto mb-2 text-amber-400" />
                                <h3 className="font-semibold mb-1 text-xs text-center">Contacto</h3>
                                <p className="text-xs text-gray-300 text-center">
                                    +34 968 123 456<br />
                                    info@barberiaelite.com
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Desktop Layout: 3 cards in a row */}
                    <div className="hidden sm:grid sm:grid-cols-3 gap-4 sm:gap-6">
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-white/20">
                            <MapPin className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 sm:mb-3 text-amber-400" />
                            <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Ubicación</h3>
                            <p className="text-xs sm:text-sm text-gray-300">
                                Calle Sta. Eulalia, 8A<br />
                                30850 Totana, Murcia
                            </p>
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-white/20">
                            <Calendar className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 sm:mb-3 text-amber-400" />
                            <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Horarios</h3>
                            <p className="text-xs sm:text-sm text-gray-300">
                                Lun - Vie: 9:00 - 19:00<br />
                                Sáb: 9:00 - 17:00
                            </p>
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-white/20">
                            <Phone className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 sm:mb-3 text-amber-400" />
                            <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Contacto</h3>
                            <p className="text-xs sm:text-sm text-gray-300">
                                +34 968 123 456<br />
                                info@barberiaelite.com
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1 }}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            >
                <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
                    <motion.div
                        animate={{ y: [0, 12, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-1 h-3 bg-white rounded-full mt-2"
                    />
                </div>
            </motion.div>
        </section>
    )
}
