'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, startOfWeek, endOfWeek, addDays } from 'date-fns'
import { es } from 'date-fns/locale'

interface CalendarPopupProps {
    selectedDate: Date
    onDateSelect: (date: Date) => void
    maxAdvanceDays?: number
}

export default function CalendarPopup({ selectedDate, onDateSelect, maxAdvanceDays = 90 }: CalendarPopupProps) {
    const [currentMonth, setCurrentMonth] = useState(selectedDate)

    const today = new Date()
    const maxDate = addDays(today, maxAdvanceDays)

    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(currentMonth)
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 }) // Start week on Monday
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })

    const calendarDays = eachDayOfInterval({
        start: calendarStart,
        end: calendarEnd
    })

    const nextMonth = () => {
        const newMonth = addMonths(currentMonth, 1)
        if (newMonth <= startOfMonth(maxDate)) {
            setCurrentMonth(newMonth)
        }
    }

    const prevMonth = () => {
        const newMonth = subMonths(currentMonth, 1)
        if (newMonth >= startOfMonth(today)) {
            setCurrentMonth(newMonth)
        }
    }

    return (
        <div className="w-80">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-4">
                <button
                    onClick={prevMonth}
                    disabled={currentMonth <= startOfMonth(today)}
                    className={`p-2 rounded-lg transition-colors ${currentMonth <= startOfMonth(today)
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'
                        }`}
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>

                <h3 className="text-lg font-semibold text-gray-900">
                    {format(currentMonth, 'MMMM yyyy', { locale: es })}
                </h3>

                <button
                    onClick={nextMonth}
                    disabled={currentMonth >= startOfMonth(maxDate)}
                    className={`p-2 rounded-lg transition-colors ${currentMonth >= startOfMonth(maxDate)
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'
                        }`}
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>

            {/* Week Days Header */}
            <div className="grid grid-cols-7 gap-1 mb-2">
                {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day) => (
                    <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day) => {
                    const isCurrentMonth = isSameMonth(day, currentMonth)
                    const isSelected = isSameDay(day, selectedDate)
                    const isToday = isSameDay(day, new Date())
                    const isDisabled = day < today || day > maxDate

                    return (
                        <button
                            key={day.toISOString()}
                            onClick={() => !isDisabled && onDateSelect(day)}
                            disabled={isDisabled}
                            className={`
                p-2 text-sm rounded-lg transition-colors
                ${!isCurrentMonth ? 'text-gray-300' : ''}
                ${isDisabled ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}
                ${isToday ? 'bg-blue-100 text-blue-700 font-semibold' : ''}
                ${isSelected ? 'bg-amber-500 text-white font-semibold' : ''}
              `}
                        >
                            {format(day, 'd')}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
