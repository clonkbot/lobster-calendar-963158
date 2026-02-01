import { useState, useEffect } from 'react'

interface Event {
  id: string
  title: string
  date: string
  color: string
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const EVENT_COLORS = [
  { name: 'Lobster Red', value: '#c41e3a' },
  { name: 'Coral', value: '#ff6b6b' },
  { name: 'Seafoam', value: '#5fb3b3' },
  { name: 'Sand', value: '#f5e6d3' },
]

function LobsterIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="currentColor">
      <path d="M32 8c-4 0-7 2-9 5l-8-4c-2-1-4 1-3 3l4 8c-2 3-3 6-3 10v4c0 8 6 14 14 14h10c8 0 14-6 14-14v-4c0-4-1-7-3-10l4-8c1-2-1-4-3-3l-8 4c-2-3-5-5-9-5zm-12 24c-2 0-3-1-3-3s1-3 3-3 3 1 3 3-1 3-3 3zm24 0c-2 0-3-1-3-3s1-3 3-3 3 1 3 3-1 3-3 3zm-12 8c-3 0-5-2-5-4h10c0 2-2 4-5 4z"/>
      <path d="M8 20c-2-4-6-6-6-6s2 6 4 8c1 1 2 0 2-2zm48 0c2-4 6-6 6-6s-2 6-4 8c-1 1-2 0-2-2z" opacity="0.7"/>
    </svg>
  )
}

function ClawLeft({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="currentColor">
      <path d="M40 24c0-8-6-16-16-16-2 0-4 2-4 4v24c0 2 2 4 4 4 10 0 16-8 16-16z"/>
      <path d="M8 12c-4 4-6 10-6 14s2 8 6 10c2 1 4-1 3-3l-2-6c-1-2-1-4 0-6l2-6c1-2-1-4-3-3z"/>
    </svg>
  )
}

function ClawRight({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="currentColor" style={{ transform: 'scaleX(-1)' }}>
      <path d="M40 24c0-8-6-16-16-16-2 0-4 2-4 4v24c0 2 2 4 4 4 10 0 16-8 16-16z"/>
      <path d="M8 12c-4 4-6 10-6 14s2 8 6 10c2 1 4-1 3-3l-2-6c-1-2-1-4 0-6l2-6c1-2-1-4-3-3z"/>
    </svg>
  )
}

function Bubble({ delay, left, size }: { delay: number; left: number; size: number }) {
  return (
    <div
      className="absolute rounded-full bg-seafoam opacity-20 animate-bubble"
      style={{
        left: `${left}%`,
        bottom: 0,
        width: size,
        height: size,
        animationDelay: `${delay}s`,
        animationDuration: `${8 + Math.random() * 4}s`,
      }}
    />
  )
}

function App() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [events, setEvents] = useState<Event[]>(() => {
    const saved = localStorage.getItem('lobster-events')
    return saved ? JSON.parse(saved) : []
  })
  const [showModal, setShowModal] = useState(false)
  const [newEventTitle, setNewEventTitle] = useState('')
  const [newEventColor, setNewEventColor] = useState(EVENT_COLORS[0].value)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    localStorage.setItem('lobster-events', JSON.stringify(events))
  }, [events])

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const today = new Date()

  const goToPrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const handleDayClick = (day: number) => {
    setSelectedDate(new Date(year, month, day))
    setShowModal(true)
  }

  const addEvent = () => {
    if (!newEventTitle.trim() || !selectedDate) return
    const event: Event = {
      id: Date.now().toString(),
      title: newEventTitle,
      date: selectedDate.toISOString().split('T')[0],
      color: newEventColor,
    }
    setEvents([...events, event])
    setNewEventTitle('')
    setShowModal(false)
  }

  const deleteEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id))
  }

  const getEventsForDay = (day: number) => {
    const dateStr = new Date(year, month, day).toISOString().split('T')[0]
    return events.filter(e => e.date === dateStr)
  }

  const isToday = (day: number) => {
    return today.getDate() === day && 
           today.getMonth() === month && 
           today.getFullYear() === year
  }

  const calendarDays = []
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i)
  }

  const bubbles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    delay: i * 1.5,
    left: Math.random() * 100,
    size: 8 + Math.random() * 16,
  }))

  return (
    <div className="min-h-screen ocean-gradient relative overflow-hidden flex flex-col">
      {/* Bubbles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {bubbles.map(b => (
          <Bubble key={b.id} delay={b.delay} left={b.left} size={b.size} />
        ))}
      </div>

      {/* Wave decoration */}
      <div className="absolute top-0 left-0 right-0 h-2 overflow-hidden">
        <div className="animate-wave w-[200%] h-full bg-gradient-to-r from-transparent via-seafoam/30 to-transparent" />
      </div>

      <div className={`max-w-4xl mx-auto px-4 py-8 relative z-10 transition-all duration-1000 flex-1 w-full ${
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        {/* Header */}
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-2">
            <ClawLeft className="w-12 h-12 text-coral animate-pinch cursor-pointer hidden sm:block" />
            <div className="animate-float">
              <LobsterIcon className="w-16 h-16 sm:w-20 sm:h-20 text-lobster drop-shadow-lg" />
            </div>
            <ClawRight className="w-12 h-12 text-coral animate-pinch cursor-pointer hidden sm:block" />
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-sand tracking-wide">
            Lobster Calendar
          </h1>
          <p className="text-seafoam mt-2 text-sm tracking-widest uppercase">
            Navigate the tides of time
          </p>
        </header>

        {/* Calendar Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4 bg-ocean-mid/50 backdrop-blur-sm rounded-2xl p-4 border border-seafoam/20">
          <button
            onClick={goToPrevMonth}
            className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-ocean-light/50 hover:bg-lobster transition-all duration-300 text-sand"
          >
            <span className="transform group-hover:-translate-x-1 transition-transform">🦞</span>
            <span className="font-medium">Previous</span>
          </button>

          <div className="text-center">
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-sand">
              {MONTHS[month]} {year}
            </h2>
            <button
              onClick={goToToday}
              className="text-seafoam hover:text-coral transition-colors text-sm mt-1"
            >
              ↺ Return to today
            </button>
          </div>

          <button
            onClick={goToNextMonth}
            className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-ocean-light/50 hover:bg-lobster transition-all duration-300 text-sand"
          >
            <span className="font-medium">Next</span>
            <span className="transform group-hover:translate-x-1 transition-transform" style={{ display: 'inline-block', transform: 'scaleX(-1)' }}>🦞</span>
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="bg-ocean-mid/60 backdrop-blur-md rounded-3xl p-4 sm:p-6 border border-seafoam/20 shadow-2xl">
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
            {DAYS.map(day => (
              <div
                key={day}
                className="text-center py-2 text-seafoam font-semibold text-xs sm:text-sm tracking-wider"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {calendarDays.map((day, idx) => {
              const dayEvents = day ? getEventsForDay(day) : []
              const isTodayCell = day && isToday(day)

              return (
                <div
                  key={idx}
                  onClick={() => day && handleDayClick(day)}
                  className={`
                    calendar-day relative min-h-[60px] sm:min-h-[80px] rounded-xl p-1 sm:p-2 cursor-pointer
                    ${day ? 'bg-ocean-light/40 hover:bg-ocean-light/70' : 'bg-transparent'}
                    ${isTodayCell ? 'ring-2 ring-coral ring-offset-2 ring-offset-ocean-mid' : ''}
                    transition-all duration-300
                  `}
                >
                  {day && (
                    <>
                      <span className={`
                        text-sm sm:text-base font-semibold
                        ${isTodayCell ? 'text-coral' : 'text-sand'}
                      `}>
                        {day}
                      </span>
                      {isTodayCell && (
                        <span className="absolute top-1 right-1 sm:top-2 sm:right-2 text-xs">🦞</span>
                      )}
                      <div className="mt-1 space-y-0.5 overflow-hidden">
                        {dayEvents.slice(0, 2).map(event => (
                          <div
                            key={event.id}
                            className="text-xs truncate px-1 py-0.5 rounded text-ocean-deep font-medium"
                            style={{ backgroundColor: event.color }}
                          >
                            {event.title}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-xs text-seafoam">+{dayEvents.length - 2} more</div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Decorative lobster trail */}
        <div className="flex justify-center mt-8 gap-2 opacity-40">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="text-2xl" style={{ animationDelay: `${i * 0.2}s` }}>
              🦞
            </span>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedDate && (
        <div 
          className="fixed inset-0 bg-ocean-deep/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="bg-ocean-mid border border-seafoam/30 rounded-3xl p-6 max-w-md w-full shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-2xl text-sand">
                {selectedDate.toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-sand hover:text-coral transition-colors text-2xl"
              >
                ×
              </button>
            </div>

            {/* Existing events */}
            <div className="mb-4 space-y-2 max-h-40 overflow-y-auto">
              {getEventsForDay(selectedDate.getDate()).map(event => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-2 rounded-lg"
                  style={{ backgroundColor: event.color + '30' }}
                >
                  <span className="text-sand flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: event.color }}
                    />
                    {event.title}
                  </span>
                  <button
                    onClick={() => deleteEvent(event.id)}
                    className="text-coral hover:text-lobster transition-colors"
                  >
                    🗑
                  </button>
                </div>
              ))}
            </div>

            {/* Add new event */}
            <div className="space-y-4">
              <input
                type="text"
                placeholder="What's on the agenda?"
                value={newEventTitle}
                onChange={e => setNewEventTitle(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addEvent()}
                className="w-full px-4 py-3 rounded-xl bg-ocean-light/50 border border-seafoam/30 text-sand placeholder-seafoam/50 focus:outline-none focus:ring-2 focus:ring-coral transition-all"
              />

              <div className="flex gap-2">
                {EVENT_COLORS.map(color => (
                  <button
                    key={color.value}
                    onClick={() => setNewEventColor(color.value)}
                    className={`w-8 h-8 rounded-full transition-transform hover:scale-110 ${
                      newEventColor === color.value ? 'ring-2 ring-sand ring-offset-2 ring-offset-ocean-mid scale-110' : ''
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>

              <button
                onClick={addEvent}
                disabled={!newEventTitle.trim()}
                className="w-full py-3 rounded-xl lobster-gradient text-sand font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <span>🦞</span>
                <span>Add to Calendar</span>
                <span>🦞</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center">
        <p className="text-seafoam/40 text-xs tracking-wide">
          Requested by @Frosty_Icy_ · Built by @clonkbot
        </p>
      </footer>

      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden">
        <div className="animate-wave w-[200%] h-full bg-gradient-to-r from-transparent via-coral/20 to-transparent" style={{ animationDirection: 'reverse' }} />
      </div>
    </div>
  )
}

export default App