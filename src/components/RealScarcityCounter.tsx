import { useEffect, useState } from 'react'

interface RealScarcityCounterProps {
  market?: string
  onSlotsChange?: (available: number) => void
}

export function RealScarcityCounter({
  market = 'default',
  onSlotsChange,
}: RealScarcityCounterProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 1, hours: 23, minutes: 59, seconds: 45 })
  const [slotsAvailable, setSlotsAvailable] = useState(3)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch available slots from database
  // MOCKED for static Next.js port
  const [slotsData, setSlotsData] = useState<{ available: number } | null>(null)
  const [slotsLoading, setSlotsLoading] = useState(true)

  useEffect(() => {
    let active = true
    setSlotsLoading(true)
    setTimeout(() => {
      if (active) {
        // generate a pseudo-random available count based on market string length
        const fakeAvailable = (market.length % 3) + 1
        setSlotsData({ available: fakeAvailable })
        setSlotsLoading(false)
      }
    }, 500)
    return () => {
      active = false
    }
  }, [market])

  useEffect(() => {
    if (slotsData) {
      setSlotsAvailable(slotsData.available)
      onSlotsChange?.(slotsData.available)
      setIsLoading(false)
    }
  }, [slotsData, onSlotsChange])

  // Update countdown timer every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        let { days, hours, minutes, seconds } = prev

        if (seconds > 0) {
          seconds--
        } else if (minutes > 0) {
          minutes--
          seconds = 59
        } else if (hours > 0) {
          hours--
          minutes = 59
          seconds = 59
        } else if (days > 0) {
          days--
          hours = 23
          minutes = 59
          seconds = 59
        } else {
          // Reset to 7 days when countdown reaches 0
          days = 7
          hours = 0
          minutes = 0
          seconds = 0
        }

        return { days, hours, minutes, seconds }
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const progressPercent =
    ((timeLeft.days * 24 * 60 * 60 +
      timeLeft.hours * 60 * 60 +
      timeLeft.minutes * 60 +
      timeLeft.seconds) /
      (7 * 24 * 60 * 60)) *
    100
  const slotsPercentage = (slotsAvailable / 3) * 100

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-xl p-8 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/50 mb-4">
            <span className="text-xs font-semibold text-cyan-400 tracking-wider">
              LIMITED AVAILABILITY
            </span>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Secure Your Market Access Before This Offer Closes
          </h3>
        </div>

        {/* Countdown Timer */}
        <div className="grid grid-cols-4 gap-3 md:gap-4 mb-8">
          {[
            { value: String(timeLeft.days).padStart(2, '0'), label: 'DAYS' },
            { value: String(timeLeft.hours).padStart(2, '0'), label: 'HOURS' },
            { value: String(timeLeft.minutes).padStart(2, '0'), label: 'MINUTES' },
            { value: String(timeLeft.seconds).padStart(2, '0'), label: 'SECONDS' },
          ].map((item, idx) => (
            <div key={idx} className="text-center">
              <div className="relative">
                <div className="rounded-lg border border-cyan-500/50 bg-slate-800/80 backdrop-blur p-3 md:p-4">
                  <div className="text-2xl md:text-3xl font-bold text-cyan-400 font-mono">
                    {item.value}
                  </div>
                </div>
              </div>
              <div className="text-xs font-semibold text-gray-400 mt-2 tracking-wider">
                {item.label}
              </div>
            </div>
          ))}
        </div>

        {/* Slots Available with Live Data */}
        <div className="text-center mb-6">
          {isLoading || slotsLoading ? (
            <div className="text-sm text-gray-300 mb-2">
              <span className="inline-block w-4 h-4 rounded-full bg-cyan-400 animate-pulse" />
            </div>
          ) : (
            <>
              <div className="text-sm text-gray-300 mb-2">
                Only <span className="font-bold text-yellow-400">{slotsAvailable}</span> slot
                {slotsAvailable !== 1 ? 's' : ''} available for this market. First-come,
                first-served.
              </div>
              {/* Slots Progress Bar */}
              <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-300"
                  style={{ width: `${slotsPercentage}%` }}
                />
              </div>
              <div className="text-xs text-gray-400">{3 - slotsAvailable} claimed this week</div>
            </>
          )}
        </div>

        {/* CTA Button */}
        <div className="flex justify-center mb-6">
          <button
            className="px-8 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={slotsAvailable === 0}
          >
            {slotsAvailable === 0 ? 'Slots Full - Check Back Next Week' : 'Claim Your Slot Now'}
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-purple-600 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-1000"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Time Remaining Text */}
        <div className="text-center mt-4 text-xs text-gray-400">
          {timeLeft.days}d {String(timeLeft.hours).padStart(2, '0')}h{' '}
          {String(timeLeft.minutes).padStart(2, '0')}m remaining
        </div>
      </div>
    </div>
  )
}
