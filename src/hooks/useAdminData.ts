// Custom hook for admin data management
import { useState, useEffect } from 'react'
import { Employee, Service, Appointment, BookingSettings } from '@/types/admin'

export function useAdminData() {
    const [employees, setEmployees] = useState<Employee[]>([])
    const [services, setServices] = useState<Service[]>([])
    const [appointments, setAppointments] = useState<Appointment[]>([])
    const [bookingSettings, setBookingSettings] = useState<BookingSettings | null>(null)
    const [loading, setLoading] = useState(false)

    const fetchData = async () => {
        setLoading(true)
        try {
            const [employeesRes, servicesRes, appointmentsRes, settingsRes] = await Promise.all([
                fetch('/api/employees'),
                fetch('/api/services'),
                fetch('/api/appointments'),
                fetch('/api/booking-settings')
            ])

            if (employeesRes.ok) {
                const data = await employeesRes.json()
                setEmployees(data.employees || [])
            }

            if (servicesRes.ok) {
                const data = await servicesRes.json()
                setServices(data.services || [])
            }

            if (appointmentsRes.ok) {
                const data = await appointmentsRes.json()
                setAppointments(data.appointments || [])
            }

            if (settingsRes.ok) {
                const data = await settingsRes.json()
                setBookingSettings(data.settings)
            }
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setLoading(false)
        }
    }

    const updateBookingSettings = async (updates: Partial<BookingSettings>) => {
        try {
            const response = await fetch('/api/booking-settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates)
            })

            if (response.ok) {
                const data = await response.json()
                setBookingSettings(data.settings)
            }
        } catch (error) {
            console.error('Error updating settings:', error)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    return {
        employees,
        services,
        appointments,
        bookingSettings,
        loading,
        fetchData,
        updateBookingSettings
    }
}
