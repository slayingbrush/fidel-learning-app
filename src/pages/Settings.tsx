import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import {
  supportsNotifications,
  getPermissionState,
  requestPermission,
  scheduleReminder,
  cancelScheduled,
} from '../notifications/reminders'
import { loadReminderSettings, saveReminderSettings } from '../storage/db'

const PRESET_TIMES = [
  { label: 'Morning',   time: '08:00', sub: '8:00 AM' },
  { label: 'Afternoon', time: '13:00', sub: '1:00 PM' },
  { label: 'Evening',   time: '19:00', sub: '7:00 PM' },
  { label: 'Night',     time: '21:00', sub: '9:00 PM' },
]

function formatTime(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 || 12
  return `${h12}:${m.toString().padStart(2, '0')} ${period}`
}

export function Settings() {
  const profile = useAppStore(s => s.profile)

  const [enabled, setEnabled]       = useState(false)
  const [time, setTime]             = useState('19:00')
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [loading, setLoading]       = useState(true)

  useEffect(() => {
    setPermission(getPermissionState())
    loadReminderSettings().then(settings => {
      if (settings) {
        setEnabled(settings.enabled)
        setTime(settings.time)
        if (settings.enabled && profile?.lastSession) {
          scheduleReminder(settings.time, profile.lastSession)
        }
      }
      setLoading(false)
    })
  }, [profile?.lastSession])

  const toggleReminders = async () => {
    if (!enabled) {
      const perm = await requestPermission()
      setPermission(perm)
      if (perm !== 'granted') return
      await saveReminderSettings({ id: 'reminders', enabled: true, time })
      setEnabled(true)
      scheduleReminder(time, profile?.lastSession ?? 0)
    } else {
      cancelScheduled()
      await saveReminderSettings({ id: 'reminders', enabled: false, time })
      setEnabled(false)
    }
  }

  const changeTime = async (newTime: string) => {
    setTime(newTime)
    await saveReminderSettings({ id: 'reminders', enabled, time: newTime })
    if (enabled) {
      cancelScheduled()
      scheduleReminder(newTime, profile?.lastSession ?? 0)
    }
  }

  if (loading) return null

  return (
    <div className="flex flex-col pb-24 px-4 pt-6 max-w-lg mx-auto w-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link
          to="/progress"
          className="tap-target flex items-center justify-center w-10 h-10 rounded-xl
                     text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors -ml-2"
          aria-label="Back to Progress"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="font-display text-3xl font-semibold text-[var(--color-text)] tracking-tight">
          Settings
        </h1>
      </div>

      <div className="space-y-6">
        {/* Reminders section */}
        <div className="space-y-3">
          <h2 className="font-sans text-xs font-semibold text-gray-400 uppercase tracking-wider px-1">
            Daily Reminders
          </h2>

          {!supportsNotifications() ? (
            <div className="bg-gray-50 rounded-2xl border border-gray-100 p-5">
              <p className="font-sans text-sm text-gray-500">
                Notifications aren't supported in this browser. Try using Chrome or Safari on your device.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[var(--color-border)] divide-y divide-[var(--color-border)]">

              {/* Toggle row */}
              <div className="flex items-center justify-between p-5 gap-4">
                <div className="min-w-0">
                  <p className="font-sans font-semibold text-sm text-[var(--color-text)]">
                    Daily reminder
                  </p>
                  <p className="font-sans text-xs text-gray-500 mt-0.5 leading-snug">
                    {enabled && permission === 'granted'
                      ? `Reminds you at ${formatTime(time)} if you haven't practiced`
                      : 'Get a nudge if you miss a day'}
                  </p>
                </div>
                <button
                  onClick={toggleReminders}
                  role="switch"
                  aria-checked={enabled}
                  className={`relative w-12 h-7 rounded-full transition-colors flex-shrink-0 focus-visible:outline-2
                    focus-visible:outline-offset-2 focus-visible:outline-teal-600
                    ${enabled && permission === 'granted' ? 'bg-teal-600' : 'bg-gray-200'}`}
                >
                  <span
                    className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow-sm
                      transition-transform duration-200
                      ${enabled && permission === 'granted' ? 'translate-x-5' : 'translate-x-0'}`}
                  />
                </button>
              </div>

              {/* Permission denied warning */}
              {permission === 'denied' && (
                <div className="px-5 py-4 bg-red-50">
                  <p className="font-sans text-xs text-red-700 leading-relaxed">
                    Notifications are blocked. To enable them, open your browser's site settings and allow
                    notifications for this site, then try again.
                  </p>
                </div>
              )}

              {/* Time picker — only when active */}
              {enabled && permission === 'granted' && (
                <div className="p-5 space-y-4">
                  <p className="font-sans text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Reminder time
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                    {PRESET_TIMES.map(preset => (
                      <button
                        key={preset.time}
                        onClick={() => changeTime(preset.time)}
                        className={`rounded-xl border-2 py-3 px-4 text-left transition-all tap-target
                          ${time === preset.time
                            ? 'border-teal-500 bg-teal-50'
                            : 'border-[var(--color-border)] bg-white hover:border-teal-300'}`}
                      >
                        <p className={`font-sans text-sm font-semibold
                          ${time === preset.time ? 'text-teal-700' : 'text-[var(--color-text)]'}`}>
                          {preset.label}
                        </p>
                        <p className={`font-sans text-xs mt-0.5
                          ${time === preset.time ? 'text-teal-600' : 'text-gray-400'}`}>
                          {preset.sub}
                        </p>
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    <label
                      htmlFor="custom-time"
                      className="font-sans text-sm text-gray-500 shrink-0"
                    >
                      Custom
                    </label>
                    <input
                      id="custom-time"
                      type="time"
                      value={time}
                      onChange={e => { if (e.target.value) changeTime(e.target.value) }}
                      className="flex-1 font-sans text-sm text-[var(--color-text)] bg-white border-2
                                 border-[var(--color-border)] rounded-xl px-3 py-2.5 outline-none
                                 focus:border-teal-500 transition-colors"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          <p className="font-sans text-xs text-gray-400 leading-relaxed px-1">
            Reminders work best when Fidel is installed on your home screen. They fire
            while the app is running in the background.
          </p>
        </div>

        {/* About section */}
        <div className="space-y-3">
          <h2 className="font-sans text-xs font-semibold text-gray-400 uppercase tracking-wider px-1">
            About
          </h2>
          <div className="bg-white rounded-2xl border border-[var(--color-border)] divide-y divide-[var(--color-border)]">
            <div className="flex items-center justify-between px-5 py-4">
              <span className="font-sans text-sm text-gray-500">Language</span>
              <span className="font-sans text-sm font-semibold text-[var(--color-text)] capitalize">
                {profile?.language ?? '—'}
              </span>
            </div>
            <div className="flex items-center justify-between px-5 py-4">
              <span className="font-sans text-sm text-gray-500">Version</span>
              <span className="font-sans text-sm font-semibold text-[var(--color-text)]">1.0.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
