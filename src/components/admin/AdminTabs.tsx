// Admin Tabs Component
import { AdminTab, AdminTabConfig } from '@/types/admin'
import { Calendar, Users, Settings, Clock } from 'lucide-react'

interface AdminTabsProps {
    activeTab: AdminTab
    onTabChange: (tab: AdminTab) => void
}

const tabs: AdminTabConfig[] = [
    { id: 'summary', label: 'Resumen', icon: Calendar },
    { id: 'schedule', label: 'Horarios', icon: Calendar },
    { id: 'employees', label: 'Empleados', icon: Users },
    { id: 'services', label: 'Servicios', icon: Settings },
    { id: 'settings', label: 'Configuración', icon: Clock }
]

export default function AdminTabs({ activeTab, onTabChange }: AdminTabsProps) {
    return (
        <div className="bg-white rounded-xl shadow-lg mb-8 overflow-hidden">
            <div className="border-b border-gray-100">
                <nav className="flex space-x-1 px-6 overflow-x-auto">
                    {tabs.map((tab) => {
                        const Icon = tab.icon
                        return (
                            <button
                                key={tab.id}
                                onClick={() => onTabChange(tab.id)}
                                className={`flex items-center gap-3 py-5 px-4 border-b-3 font-semibold text-sm transition-all duration-200 whitespace-nowrap ${activeTab === tab.id
                                        ? 'border-amber-500 text-amber-600 bg-amber-50'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span>{tab.label}</span>
                            </button>
                        )
                    })}
                </nav>
            </div>
        </div>
    )
}
