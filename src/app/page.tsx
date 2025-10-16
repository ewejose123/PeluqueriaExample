import Navigation from '@/components/Navigation'
import HeroSection from '@/components/HeroSection'
import RatingBanner from '@/components/RatingBanner'
import ServicesSection from '@/components/ServicesSection'
import ContactSection from '@/components/ContactSection'
import TestimonialsSection from '@/components/TestimonialsSection'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <div id="home">
          <HeroSection />
        </div>
        <RatingBanner />
        <ServicesSection />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
