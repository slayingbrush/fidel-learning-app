import { NavLink } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import { buildReviewQueue } from '../srs/queue'
import { useUnlockedChars } from '../store/useAppStore'

const navItems = [
  {
    to: '/learn',
    label: 'Learn',
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 2} className="w-6 h-6 shrink-0">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    to: '/practice',
    label: 'Practice',
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 2} className="w-6 h-6 shrink-0">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    to: '/read',
    label: 'Read',
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 2} className="w-6 h-6 shrink-0">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
      </svg>
    ),
  },
  {
    to: '/sheets',
    label: 'Sheets',
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 2} className="w-6 h-6 shrink-0">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
      </svg>
    ),
  },
  {
    to: '/progress',
    label: 'Progress',
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 2} className="w-6 h-6 shrink-0">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
]

export function Navigation() {
  const cardStates    = useAppStore(s => s.cardStates)
  const unlockedChars = useUnlockedChars()
  const dueCount      = buildReviewQueue(unlockedChars, cardStates).length

  return (
    <nav
      aria-label="Main navigation"
      className={`
        no-print fixed z-50 bg-white border-[var(--color-border)]
        bottom-0 left-0 right-0 border-t safe-area-pb
        md:bottom-auto md:top-0 md:right-auto md:h-full md:w-56
        md:border-t-0 md:border-r md:flex md:flex-col
      `}
    >
      {/* App branding — desktop only */}
      <div className="hidden md:flex items-center gap-3 px-5 py-5 border-b border-[var(--color-border)]">
        <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center shadow-sm shadow-teal-200">
          <span className="font-ethiopic text-lg text-white leading-none">ፊ</span>
        </div>
        <span className="font-display text-xl font-semibold text-[var(--color-text)] tracking-tight">
          Fidel
        </span>
      </div>

      {/* Nav items */}
      <div className="flex md:flex-col md:flex-1 md:px-3 md:py-4 md:gap-0.5">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `relative flex-1 flex flex-col items-center gap-1 py-2 px-1 transition-colors
               md:flex-none md:flex-row md:gap-3 md:px-3 md:py-3 md:rounded-xl
               ${isActive
                 ? 'text-teal-600 md:bg-teal-50'
                 : 'text-gray-400 hover:text-gray-600 md:hover:bg-gray-50'}`
            }
          >
            {({ isActive }) => (
              <>
                <div className="relative">
                  {item.icon(isActive)}
                  {item.to === '/practice' && dueCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-0.5 bg-amber-500 text-white
                                     text-[10px] font-bold rounded-full flex items-center justify-center
                                     leading-none badge-pulse">
                      {dueCount > 99 ? '99+' : dueCount}
                    </span>
                  )}
                </div>
                <span className="text-[10px] md:text-sm md:font-medium font-sans leading-none">
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
