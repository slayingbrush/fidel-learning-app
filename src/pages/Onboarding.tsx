import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { useAppStore } from '../store/useAppStore'
import type { Language } from '../data/types'
import { AudioButton } from '../components/AudioButton'

const stepVariants = {
  enter: { opacity: 0, y: 14 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
}
const stepTransition = { duration: 0.26, ease: [0.25, 1, 0.5, 1] as const }

type Step = 'welcome' | 'language' | 'name' | 'ready'

const LANG_OPTIONS: { value: Language; label: string; fidel: string; description: string }[] = [
  {
    value: 'amharic',
    label: 'Amharic',
    fidel: 'አማርኛ',
    description: 'Official language of Ethiopia — 35 million speakers',
  },
  {
    value: 'tigrinya',
    label: 'Tigrinya',
    fidel: 'ትግርኛ',
    description: 'Language of Tigray & Eritrea — 9 million speakers',
  },
]

export function Onboarding() {
  const [step, setStep] = useState<Step>('welcome')
  const [language, setLanguage] = useState<Language | null>(null)
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const createProfile = useAppStore(s => s.createProfile)
  const navigate = useNavigate()

  const finish = async () => {
    if (!language) return
    setLoading(true)
    await createProfile(language, name.trim())
    navigate('/learn', { replace: true })
  }

  return (
    <div className="min-h-svh bg-[var(--color-bg)] flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <AnimatePresence mode="wait">

          {/* ── Welcome ── */}
          {step === 'welcome' && (
            <motion.div
              key="welcome"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={stepTransition}
              className="flex flex-col items-center text-center gap-6"
            >
              <div className="w-20 h-20 rounded-3xl bg-teal-600 flex items-center justify-center shadow-lg shadow-teal-200">
                <span className="font-ethiopic text-4xl text-white">ፊ</span>
              </div>

              <div className="space-y-2">
                <h1 className="font-display text-4xl font-semibold text-[var(--color-text)] tracking-tight">
                  Fidel
                </h1>
                <p className="font-sans text-gray-500 text-lg leading-relaxed">
                  Learn to read the Ge'ez script — one character at a time.
                </p>
              </div>

              <div className="bg-teal-50 rounded-2xl p-5 text-left space-y-3">
                <p className="font-sans text-sm font-semibold text-teal-700">
                  Built for speakers, not beginners
                </p>
                <p className="font-sans text-sm text-gray-600 leading-relaxed">
                  You already know the language. This app teaches you to decode the
                  characters — connecting the sounds you speak to the symbols on the page.
                </p>
              </div>

              <button
                onClick={() => setStep('language')}
                className="w-full bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-sans font-semibold
                           text-base py-4 rounded-2xl transition-all shadow-md shadow-teal-200"
              >
                Get started
              </button>
            </motion.div>
          )}

          {/* ── Language selection ── */}
          {step === 'language' && (
            <motion.div
              key="language"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={stepTransition}
              className="flex flex-col gap-6"
            >
              <div className="text-center space-y-2">
                <h2 className="font-display text-3xl font-semibold text-[var(--color-text)] tracking-tight">
                  Which language do you speak?
                </h2>
                <p className="font-sans text-sm text-gray-500">
                  The app will tailor words and examples to your language.
                </p>
              </div>

              <div className="space-y-3">
                {LANG_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setLanguage(opt.value)}
                    className={`w-full text-left rounded-2xl border-2 p-5 transition-all tap-target
                      ${language === opt.value
                        ? 'border-teal-500 bg-teal-50 shadow-md shadow-teal-100'
                        : 'border-[var(--color-border)] bg-white hover:border-teal-300'}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <span className="font-sans font-semibold text-[var(--color-text)] text-base">
                            {opt.label}
                          </span>
                          <AudioButton text={opt.label} language={opt.value} size="sm" />
                        </div>
                        <p className={`font-sans text-xs ${language === opt.value ? 'text-teal-700' : 'text-gray-500'}`}>{opt.description}</p>
                      </div>
                      <span className="font-ethiopic text-3xl text-teal-600 ml-4 shrink-0">
                        {opt.fidel}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={() => language && setStep('name')}
                disabled={!language}
                className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed
                           active:scale-95 text-white font-sans font-semibold text-base py-4 rounded-2xl
                           transition-all shadow-md shadow-teal-200 disabled:shadow-none"
              >
                Continue
              </button>
            </motion.div>
          )}

          {/* ── Name (optional) ── */}
          {step === 'name' && (
            <motion.div
              key="name"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={stepTransition}
              className="flex flex-col gap-6"
            >
              <div className="text-center space-y-2">
                <h2 className="font-display text-3xl font-semibold text-[var(--color-text)] tracking-tight">
                  What should we call you?
                </h2>
                <p className="font-sans text-sm text-gray-500">Optional — you can skip this.</p>
              </div>

              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && setStep('ready')}
                placeholder="Your name"
                maxLength={40}
                className="w-full font-sans text-lg text-[var(--color-text)] bg-white border-2
                           border-[var(--color-border)] rounded-2xl px-5 py-4 outline-none
                           focus:border-teal-500 transition-colors placeholder:text-gray-300"
              />

              <div className="space-y-3">
                <button
                  onClick={() => setStep('ready')}
                  className="w-full bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-sans
                             font-semibold text-base py-4 rounded-2xl transition-all shadow-md shadow-teal-200"
                >
                  Continue
                </button>
                <button
                  onClick={() => setStep('ready')}
                  className="w-full text-gray-400 hover:text-gray-600 font-sans text-sm py-2 transition-colors"
                >
                  Skip
                </button>
              </div>
            </motion.div>
          )}

          {/* ── Ready ── */}
          {step === 'ready' && language && (
            <motion.div
              key="ready"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={stepTransition}
              className="flex flex-col items-center text-center gap-6"
            >
              <div className="space-y-2">
                <h2 className="font-display text-3xl font-semibold text-[var(--color-text)] tracking-tight">
                  {name ? `Welcome, ${name}!` : 'You\'re ready!'}
                </h2>
                <p className="font-sans text-gray-500 text-base leading-relaxed">
                  You'll start with the five most common {language === 'amharic' ? 'Amharic' : 'Tigrinya'} consonant
                  families. Each has seven vowel forms — once you see the pattern, the whole system opens up.
                </p>
              </div>

              <div className="w-full bg-white rounded-2xl border border-[var(--color-border)] p-5 space-y-3">
                {[
                  ['Learn', 'Discover new characters and their patterns'],
                  ['Practice', 'Spaced repetition keeps what you learn'],
                  ['Read', 'Decode real words you already know how to say'],
                ].map(([title, desc]) => (
                  <div key={title} className="flex gap-3 items-start text-left">
                    <div className="w-2 h-2 rounded-full bg-teal-500 mt-2 shrink-0" />
                    <div>
                      <p className="font-sans font-semibold text-sm text-[var(--color-text)]">{title}</p>
                      <p className="font-sans text-xs text-gray-500">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={finish}
                disabled={loading}
                className="w-full bg-teal-600 hover:bg-teal-700 active:scale-95 disabled:opacity-60
                           text-white font-sans font-semibold text-base py-4 rounded-2xl
                           transition-all shadow-md shadow-teal-200"
              >
                {loading ? 'Setting up…' : 'Start learning'}
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}
