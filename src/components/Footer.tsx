'use client'

import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter } from 'lucide-react'

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Brand */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="space-y-4"
                    >
                        <h3 className="text-2xl font-bold">
                            Barbería <span className="text-amber-500">Elite</span>
                        </h3>
                        <p className="text-gray-400">
                            Donde la tradición se encuentra con el estilo moderno.
                            La mejor experiencia de barbería en Totana.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors duration-300">
                                <Facebook className="w-6 h-6" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors duration-300">
                                <Instagram className="w-6 h-6" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors duration-300">
                                <Twitter className="w-6 h-6" />
                            </a>
                        </div>
                    </motion.div>

                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        viewport={{ once: true }}
                        className="space-y-4"
                    >
                        <h4 className="text-lg font-semibold">Contacto</h4>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <MapPin className="w-5 h-5 text-amber-500" />
                                <span className="text-gray-400">
                                    Calle Sta. Eulalia, 8A<br />
                                    30850 Totana, Murcia
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-amber-500" />
                                <span className="text-gray-400">+34 968 123 456</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-amber-500" />
                                <span className="text-gray-400">info@barberiaelite.com</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Hours */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="space-y-4"
                    >
                        <h4 className="text-lg font-semibold">Horarios</h4>
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <Clock className="w-5 h-5 text-amber-500" />
                                <div>
                                    <p className="text-gray-400">Lun - Vie: 9:00 - 19:00</p>
                                    <p className="text-gray-400">Sáb: 9:00 - 17:00</p>
                                    <p className="text-gray-400">Dom: Cerrado</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Quick Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        viewport={{ once: true }}
                        className="space-y-4"
                    >
                        <h4 className="text-lg font-semibold">Enlaces Rápidos</h4>
                        <div className="space-y-2">
                            <a href="#home" className="block text-gray-400 hover:text-amber-500 transition-colors duration-300">
                                Inicio
                            </a>
                            <a href="#services" className="block text-gray-400 hover:text-amber-500 transition-colors duration-300">
                                Servicios
                            </a>
                            <a href="#contact" className="block text-gray-400 hover:text-amber-500 transition-colors duration-300">
                                Contacto
                            </a>
                            <a href="/book" className="block text-gray-400 hover:text-amber-500 transition-colors duration-300">
                                Reservar Cita
                            </a>
                        </div>
                    </motion.div>
                </div>

                {/* Bottom Bar */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    viewport={{ once: true }}
                    className="border-t border-gray-800 mt-12 pt-8 text-center"
                >
                    <p className="text-gray-400">
                        © 2024 Barbería Elite. Todos los derechos reservados.
                        Diseñado con ❤️ para nuestros clientes.
                    </p>
                </motion.div>
            </div>
        </footer>
    )
}
