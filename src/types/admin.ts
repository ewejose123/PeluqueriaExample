// Admin Panel Type Definitions
export interface Employee {
    id: string
    name: string
    email?: string
    phone?: string
    avatarUrl?: string
    isActive: boolean
    services: Service[]
    workingHours: WorkingHours[]
}

export interface Service {
    id: string
    name: string
    duration: number
    price: number
}

export interface WorkingHours {
    id: string
    dayOfWeek: number
    startTime: string
    endTime: string
    isActive: boolean
}

export interface Appointment {
    id: string
    startTime: string
    endTime: string
    clientName: string
    clientEmail: string
    clientPhone?: string
    notes?: string
    service: Service
    services?: Service[] // Support for multiple services
    employee: Employee
}

export interface BookingSettings {
    id: string
    advanceBookingDays: number
    minBookingHours: number
    maxBookingHours: number
    slotDuration: number
    bufferTime: number
    allowSameDay: boolean
    requireConfirmation: boolean
    cancellationHours: number
    maxAdvanceDays: number
    workingDays: Record<string, boolean>
    breakTimes?: Array<{ start: string; end: string }>
}

export type AdminTab = 'summary' | 'schedule' | 'employees' | 'services' | 'settings'
export type CalendarView = 'month' | 'week' | 'day'

export interface AdminTabConfig {
    id: AdminTab
    label: string
    icon: React.ComponentType<{ className?: string }>
}
