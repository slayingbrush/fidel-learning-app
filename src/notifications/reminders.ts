const NOTIFICATION_TAG = 'fidel-daily-reminder'
const NOTIFICATION_TITLE = 'Time to practice Fidel!'
const NOTIFICATION_BODY = "Don't break your streak — a few minutes keeps it going."

let _timer: ReturnType<typeof setTimeout> | null = null

export function supportsNotifications(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window
}

export function getPermissionState(): NotificationPermission {
  if (!supportsNotifications()) return 'denied'
  return Notification.permission
}

export async function requestPermission(): Promise<NotificationPermission> {
  if (!supportsNotifications()) return 'denied'
  return Notification.requestPermission()
}

function todayStudied(lastSession: number): boolean {
  if (!lastSession) return false
  const today = new Date().toISOString().slice(0, 10)
  const last = new Date(lastSession).toISOString().slice(0, 10)
  return today === last
}

async function showNotification(): Promise<void> {
  if (getPermissionState() !== 'granted') return

  const options: NotificationOptions = {
    body: NOTIFICATION_BODY,
    icon: '/icon.svg',
    tag: NOTIFICATION_TAG,
  }

  if ('serviceWorker' in navigator) {
    try {
      const reg = await navigator.serviceWorker.ready
      reg.showNotification(NOTIFICATION_TITLE, options)
      return
    } catch {
      // fall through to direct API
    }
  }

  new Notification(NOTIFICATION_TITLE, options)
}

export function cancelScheduled(): void {
  if (_timer !== null) {
    clearTimeout(_timer)
    _timer = null
  }
}

function scheduleLoop(time: string): void {
  const [h, m] = time.split(':').map(Number)
  const now = new Date()
  const next = new Date(now)
  next.setHours(h, m, 0, 0)
  if (next <= now) next.setDate(next.getDate() + 1)

  const delay = next.getTime() - now.getTime()
  _timer = setTimeout(() => {
    void showNotification()
    scheduleLoop(time) // reschedule for next day
  }, delay)
}

export function scheduleReminder(time: string, lastSession: number): void {
  cancelScheduled()
  if (getPermissionState() !== 'granted') return

  const [h, m] = time.split(':').map(Number)
  const now = new Date()
  const reminderToday = new Date(now)
  reminderToday.setHours(h, m, 0, 0)

  // Past today's reminder time and user hasn't studied → fire immediately
  if (now > reminderToday && !todayStudied(lastSession)) {
    void showNotification()
  }

  scheduleLoop(time)
}
