'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { AdminTab } from '@/types/admin'
import { useAdminData } from '@/hooks/useAdminData'
import { getAppointmentsForDate } from '@/lib/adminUtils'
import AdminHeader from '@/components/admin/AdminHeader'
import AdminTabs from '@/components/admin/AdminTabs'
import SummaryView from '@/components/admin/SummaryView'
import ScheduleView from '@/components/admin/ScheduleView'
import EmployeesView from '@/components/admin/EmployeesView'
import ServicesView from '@/components/admin/ServicesView'
import SettingsView from '@/components/admin/SettingsView'

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<AdminTab>('schedule')
    const [currentDate, setCurrentDate] = useState(new Date())
    const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null)

    const {
        employees,
        services,
        appointments,
        bookingSettings,
        loading,
        fetchData,
        updateBookingSettings
    } = useAdminData()

    const renderTabContent = () => {
        switch (activeTab) {
            case 'summary':
                return (
                    <SummaryView
                        appointments={appointments}
                        employees={employees}
                        services={services}
                    />
                )
            case 'schedule':
                return (
                    <ScheduleView
                        employees={employees}
                        appointments={appointments}
                        currentDate={currentDate}
                        setCurrentDate={setCurrentDate}
                        selectedEmployee={selectedEmployee}
                        setSelectedEmployee={setSelectedEmployee}
                    />
                )
            case 'employees':
                return (
                    <EmployeesView
                        employees={employees}
                        services={services}
                        onUpdate={fetchData}
                    />
                )
            case 'services':
                return (
                    <ServicesView
                        services={services}
                        onUpdate={fetchData}
                    />
                )
            case 'settings':
                return (
                    <SettingsView
                        settings={bookingSettings}
                        onUpdate={updateBookingSettings}
                    />
                )
            default:
                return null
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando panel de administración...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <AdminHeader appointments={appointments} employees={employees} />

            <div className="max-w-7xl mx-auto px-4 py-8">
                <AdminTabs activeTab={activeTab} onTabChange={setActiveTab} />

                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {renderTabContent()}
                </motion.div>
            </div>
        </div>
    )
}