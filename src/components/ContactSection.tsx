'use client'

import { motion } from 'framer-motion'
import { MapPin, Clock, Phone, Mail, Navigation } from 'lucide-react'

const openingHours = [
    { day: 'Lunes - Viernes', hours: '9:00 - 19:00' },
    { day: 'Sábado', hours: '9:00 - 17:00' },
    { day: 'Domingo', hours: 'Cerrado' }
]

export default function ContactSection() {
    return (
        <section id="contact" className="py-12 sm:py-16 md:py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-12 sm:mb-16"
                >
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
                        Visítanos en <span className="text-amber-500">Totana</span>
                    </h2>
                    <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-2">
                        Encuéntranos en el corazón de Totana. Ven a conocer nuestro espacio
                        y disfruta de la mejor experiencia de barbería.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
                    {/* Contact Information */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="space-y-6 sm:space-y-8"
                    >
                        <div className="bg-gray-50 rounded-xl p-6 sm:p-8">
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Información de Contacto</h3>

                            <div className="space-y-4 sm:space-y-6">
                                <div className="flex items-start gap-3 sm:gap-4">
                                    <div className="bg-amber-500 p-2 sm:p-3 rounded-lg flex-shrink-0">
                                        <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">Dirección</h4>
                                        <p className="text-gray-600 text-sm sm:text-base">
                                            Calle Sta. Eulalia, 8A<br />
                                            30850 Totana, Murcia<br />
                                            España
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 sm:gap-4">
                                    <div className="bg-amber-500 p-2 sm:p-3 rounded-lg flex-shrink-0">
                                        <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">Teléfono</h4>
                                        <p className="text-gray-600 text-sm sm:text-base">+34 968 123 456</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 sm:gap-4">
                                    <div className="bg-amber-500 p-2 sm:p-3 rounded-lg flex-shrink-0">
                                        <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">Email</h4>
                                        <p className="text-gray-600 text-sm sm:text-base">info@barberiaelite.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Opening Hours */}
                        <div className="bg-gray-50 rounded-xl p-6 sm:p-8">
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Horarios de Atención</h3>
                            <div className="space-y-3 sm:space-y-4">
                                {openingHours.map((schedule, index) => (
                                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                                        <div className="flex items-center gap-2 sm:gap-3">
                                            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
                                            <span className="font-medium text-gray-900 text-sm sm:text-base">{schedule.day}</span>
                                        </div>
                                        <span className="text-gray-600 text-sm sm:text-base">{schedule.hours}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* CTA Button */}
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <a
                                href="/book"
                                className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 sm:py-4 px-6 rounded-xl transition-colors duration-300 flex items-center justify-center gap-3 text-base sm:text-lg hover:shadow-md"
                            >
                                <Navigation className="w-5 h-5 sm:w-6 sm:h-6" />
                                Reservar Cita Ahora
                            </a>
                        </motion.div>
                    </motion.div>

                    {/* Google Maps */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="bg-gray-200 rounded-xl overflow-hidden shadow-lg">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1170.094482100921!2d-1.5027971110533258!3d37.766706314959436!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd6492dd39febcd9%3A0x75684cfbcbe4534e!2sCentro%20sociocultural%20La%20C%C3%A1rcel!5e0!3m2!1sen!2ses!4v1760618432531!5m2!1sen!2ses"
                                style={{ border: 0, width: '100%', maxWidth: '100%' }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="w-full h-[300px] sm:h-[400px] md:h-[500px] max-w-full"
                            />
                        </div>

                        {/* Map Overlay Info */}
                        {/* <div className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 sm:p-4 shadow-lg">
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
                                <div>
                                    <p className="font-semibold text-gray-900 text-sm sm:text-base">Barbería Elite</p>
                                    <p className="text-xs sm:text-sm text-gray-600">Calle Sta. Eulalia, 8A</p>
                                </div>
                            </div>
                        </div> */}
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
