'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'

interface CustomDatePickerProps {
  value: string
  onChange: (date: string) => void
}

export default function CustomDatePicker({ value, onChange }: CustomDatePickerProps) {
  const [displayMonth, setDisplayMonth] = useState(new Date())

  const getDaysInMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  const getFirstDayOfMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay()

  const handleDateClick = (day: number) => {
    const year = displayMonth.getFullYear()
    const month = String(displayMonth.getMonth() + 1).padStart(2, '0')
    const dayStr = String(day).padStart(2, '0')
    onChange(`${year}-${month}-${dayStr}`)
  }

  const handlePrevMonth = () => {
    setDisplayMonth(new Date(displayMonth.getFullYear(), displayMonth.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setDisplayMonth(new Date(displayMonth.getFullYear(), displayMonth.getMonth() + 1))
  }

  const daysInMonth = getDaysInMonth(displayMonth)
  const firstDay = getFirstDayOfMonth(displayMonth)
  const days = []

  // Empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }

  // Days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  const monthName = displayMonth.toLocaleString('default', { month: 'long', year: 'numeric' })
  const selectedDate = value ? new Date(value) : null
  const isSelectedMonth =
    selectedDate &&
    selectedDate.getMonth() === displayMonth.getMonth() &&
    selectedDate.getFullYear() === displayMonth.getFullYear()
  const selectedDay = selectedDate?.getDate()

  return (
    <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
      {/* Month/Year Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white font-semibold text-lg">{monthName}</h3>
        <div className="flex gap-2">
          <button
            onClick={handlePrevMonth}
            className="w-9 h-9 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center hover:bg-white/[0.1] transition-all duration-300"
          >
            <ChevronLeft size={18} className="text-white/60" />
          </button>
          <button
            onClick={handleNextMonth}
            className="w-9 h-9 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center hover:bg-white/[0.1] transition-all duration-300"
          >
            <ChevronRight size={18} className="text-white/60" />
          </button>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-2 mb-3">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
          <div key={day} className="text-center text-white/40 text-xs font-medium py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, idx) => (
          <div key={idx}>
            {day ? (
              <button
                onClick={() => handleDateClick(day)}
                className={`w-full aspect-square rounded-lg font-semibold text-sm transition-all duration-300 flex items-center justify-center ${
                  isSelectedMonth && selectedDay === day
                    ? 'bg-[#22D3EE] text-[#0F1419] border border-[#22D3EE]'
                    : 'bg-white/[0.05] border border-white/[0.08] text-white hover:bg-white/[0.1] hover:border-white/[0.15]'
                }`}
              >
                {day}
              </button>
            ) : (
              <div className="w-full aspect-square" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
