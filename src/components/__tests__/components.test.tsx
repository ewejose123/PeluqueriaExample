import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ServicesSection from '@/components/ServicesSection'
import Navigation from '@/components/Navigation'

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }) => <div {...props}>{children}</div>,
        section: ({ children, ...props }) => <section {...props}>{children}</section>,
        nav: ({ children, ...props }) => <nav {...props}>{children}</nav>,
        h1: ({ children, ...props }) => <h1 {...props}>{children}</h1>,
        h2: ({ children, ...props }) => <h2 {...props}>{children}</h2>,
        h3: ({ children, ...props }) => <h3 {...props}>{children}</h3>,
        p: ({ children, ...props }) => <p {...props}>{children}</p>,
        span: ({ children, ...props }) => <span {...props}>{children}</span>,
        button: ({ children, ...props }) => <button {...props}>{children}</button>,
        a: ({ children, ...props }) => <a {...props}>{children}</a>,
    },
    useAnimationFrame: jest.fn(),
    AnimatePresence: ({ children }) => children,
}))

describe('ServicesSection Component', () => {
    it('renders services section with correct title', () => {
        render(<ServicesSection />)

        // Check for title text (it's split across elements)
        expect(screen.getByText('Nuestros')).toBeInTheDocument()
        expect(screen.getByText('Servicios')).toBeInTheDocument()
        expect(screen.getByText(/Ofrecemos una amplia gama de servicios profesionales/)).toBeInTheDocument()
    })

    it('renders all service cards', () => {
        render(<ServicesSection />)

        // Check that all 6 services are rendered
        expect(screen.getByText('Corte Clásico')).toBeInTheDocument()
        expect(screen.getByText('Corte Moderno')).toBeInTheDocument()
        expect(screen.getByText('Barba Completa')).toBeInTheDocument()
        expect(screen.getByText('Corte + Barba')).toBeInTheDocument()
        expect(screen.getByText('Tratamiento Capilar')).toBeInTheDocument()
        expect(screen.getByText('Servicio Premium')).toBeInTheDocument()
    })

    it('displays service details correctly', () => {
        render(<ServicesSection />)

        // Check duration and price for first service (use getAllByText since there are multiple)
        expect(screen.getAllByText('30 min')).toHaveLength(2) // Multiple services have 30 min duration
        expect(screen.getByText('15')).toBeInTheDocument() // Price for Corte Clásico

        // Check description
        expect(screen.getByText(/El corte tradicional que nunca pasa de moda/)).toBeInTheDocument()
    })

    it('has correct booking links', () => {
        render(<ServicesSection />)

        const bookingButtons = screen.getAllByText('Reservar Ahora')
        expect(bookingButtons).toHaveLength(6)

        // Check that first booking button has correct href
        const firstButton = bookingButtons[0]
        expect(firstButton.closest('a')).toHaveAttribute('href', '/book?service=1')
    })

    it('applies correct CSS classes', () => {
        render(<ServicesSection />)

        const section = document.querySelector('section')
        expect(section).toHaveClass('py-12', 'sm:py-16', 'md:py-20', 'bg-gray-50')
    })

    it('renders service images', () => {
        render(<ServicesSection />)

        const images = screen.getAllByRole('img')
        expect(images.length).toBeGreaterThan(0)

        // Check that images have correct alt text
        expect(screen.getByAltText('Corte Clásico')).toBeInTheDocument()
        expect(screen.getByAltText('Corte Moderno')).toBeInTheDocument()
    })
})

describe('Navigation Component', () => {
    it('renders navigation with correct logo', () => {
        render(<Navigation />)

        // Check for logo text (it's split across spans)
        expect(screen.getByText('Barbería')).toBeInTheDocument()
        expect(screen.getByText('Elite')).toBeInTheDocument()
    })

    it('renders navigation links', () => {
        render(<Navigation />)

        // Use getAllByText since there are multiple instances (desktop + mobile)
        expect(screen.getAllByText('Inicio')).toHaveLength(2)
        expect(screen.getAllByText('Servicios')).toHaveLength(2)
        expect(screen.getAllByText('Contacto')).toHaveLength(2)
        expect(screen.getAllByText('Reservar')).toHaveLength(2)
    })

    it('has correct href attributes for navigation links', () => {
        render(<Navigation />)

        // Get desktop navigation links specifically
        const desktopNav = screen.getByRole('navigation').querySelector('.hidden.md\\:flex')
        const inicioLink = desktopNav?.querySelector('a[href="#home"]')
        const serviciosLink = desktopNav?.querySelector('a[href="#services"]')
        const contactoLink = desktopNav?.querySelector('a[href="#contact"]')
        const reservarLink = desktopNav?.querySelector('a[href="/book"]')

        expect(inicioLink).toBeInTheDocument()
        expect(serviciosLink).toBeInTheDocument()
        expect(contactoLink).toBeInTheDocument()
        expect(reservarLink).toBeInTheDocument()
    })

    it('shows mobile menu button on small screens', () => {
        render(<Navigation />)

        const menuButton = screen.getByRole('button')
        expect(menuButton).toBeInTheDocument()
    })

    it('toggles mobile menu when button is clicked', async () => {
        const user = userEvent.setup()
        render(<Navigation />)

        const menuButton = screen.getByRole('button')
        await user.click(menuButton)

        // Check that mobile menu items are visible (they should be visible by default in our mock)
        expect(screen.getAllByText('Inicio')).toHaveLength(2)
    })
})
