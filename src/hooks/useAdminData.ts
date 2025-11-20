// Custom hook for admin data management
import { useState, useEffect, useRef } from 'react'
import { Employee, Service, Appointment, BookingSettings } from '@/types/admin'

export function useAdminData() {
    const [employees, setEmployees] = useState<Employee[]>([])
    const [services, setServices] = useState<Service[]>([])
    const [appointments, setAppointments] = useState<Appointment[]>([])
    const [bookingSettings, setBookingSettings] = useState<BookingSettings | null>(null)
    const [loading, setLoading] = useState(false)
    const intervalRef = useRef<NodeJS.Timeout | null>(null)

    const fetchData = async () => {
        setLoading(true)
        try {
            const [employeesRes, servicesRes, appointmentsRes, settingsRes] = await Promise.all([
                fetch('/api/employees?businessSlug=sample-business'),
                fetch('/api/services?businessSlug=sample-business'),
                fetch('/api/appointments?businessSlug=sample-business'),
                fetch('/api/booking-settings?businessSlug=sample-business')
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
            const response = await fetch('/api/booking-settings?businessSlug=sample-business', {
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

        // Set up automatic refresh every 10 minutes (600,000 ms)
        intervalRef.current = setInterval(() => {
            console.log('Auto-refreshing admin data...')
            fetchData()
        }, 10 * 60 * 1000)

        // Cleanup interval on unmount
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
            }
        }
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
