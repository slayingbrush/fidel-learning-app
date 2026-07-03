import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAppStore } from './store/useAppStore'
import { useShallow } from 'zustand/react/shallow'
import { Navigation } from './components/Navigation'
import { Onboarding } from './pages/Onboarding'
import { Learn } from './pages/Learn'
import { Practice } from './pages/Practice'
import { Reading } from './pages/Reading'
import { Progress } from './pages/Progress'
import { Settings } from './pages/Settings'
import { Sheets } from './pages/Sheets'

function AppRoutes() {
  const { hydrated, profile } = useAppStore(
    useShallow(s => ({ hydrated: s.hydrated, profile: s.profile }))
  )

  if (!hydrated) {
    return (
      <div role="status" aria-label="Loading" className="min-h-svh flex items-center justify-center bg-[var(--color-bg)]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-teal-600 flex items-center justify-center shadow-lg shadow-teal-200">
            <span className="font-ethiopic text-3xl text-white">ፊ</span>
          </div>
          <div className="w-6 h-6 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <Routes>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="*" element={<Navigate to="/onboarding" replace />} />
      </Routes>
    )
  }

  return (
    <>
      <div className="md:pl-56">
        <Routes>
          <Route path="/learn"    element={<Learn />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/read"     element={<Reading />} />
          <Route path="/sheets"   element={<Sheets />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*"         element={<Navigate to="/learn" replace />} />
        </Routes>
      </div>
      <Navigation />
    </>
  )
}

export default function App() {
  const hydrate = useAppStore(s => s.hydrate)

  useEffect(() => {
    hydrate()
  }, [hydrate])

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
