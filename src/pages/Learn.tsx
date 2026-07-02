import { useState, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useAppStore, useLanguage } from '../store/useAppStore'
import { useShallow } from 'zustand/react/shallow'
import { getFamiliesByGroup } from '../data/fidel'
import { buildChoices } from '../srs/queue'
import { getCharsForLanguage } from '../data/fidel'
import { AudioButton } from '../components/AudioButton'
import type { ConsonantFamily, FidelChar } from '../data/types'
import { VOWEL_ORDER_INFO } from '../data/types'


type LearnStep = 'family-list' | 'intro' | 'orders' | 'quiz'

interface QuizState {
  questionChar: FidelChar
  choices: FidelChar[]
  selected: string | null
  correct: boolean | null
}

export function Learn() {
  const language = useLanguage()
  const { unlockedFamilies, unlockFamily } = useAppStore(
    useShallow(s => ({ unlockedFamilies: s.unlockedFamilies, unlockFamily: s.unlockFamily }))
  )

  const [step, setStep] = useState<LearnStep>('family-list')
  const [activeFamily, setActiveFamily] = useState<ConsonantFamily | null>(null)
  const [orderIndex, setOrderIndex] = useState(0)
  const [quiz, setQuiz] = useState<QuizState | null>(null)
  const [quizProgress, setQuizProgress] = useState(0)
  const [quizTotal] = useState(3)
  const [shakeId, setShakeId] = useState<string | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

  const groupedFamilies = getFamiliesByGroup(language)
  const allGroups = [...groupedFamilies.keys()].sort((a, b) => a - b)
  const allChars = getCharsForLanguage(language)

  const startFamily = (family: ConsonantFamily) => {
    setActiveFamily(family)
    setOrderIndex(0)
    setStep('intro')
  }

  const goToOrders = () => {
    setOrderIndex(0)
    setStep('orders')
  }

  const nextOrder = () => {
    if (!activeFamily) return
    if (orderIndex < activeFamily.chars.length - 1) {
      setOrderIndex(i => i + 1)
    } else {
      startQuiz()
    }
  }

  const startQuiz = () => {
    if (!activeFamily) return
    const char = activeFamily.chars[Math.floor(Math.random() * activeFamily.chars.length)]
    const choices = buildChoices(char, allChars)
    setQuiz({ questionChar: char, choices, selected: null, correct: null })
    setQuizProgress(0)
    setStep('quiz')
  }

  const handleQuizAnswer = async (charId: string) => {
    if (!quiz || quiz.selected) return
    const correct = charId === quiz.questionChar.id
    if (!correct) setShakeId(charId)
    setQuiz(q => q ? { ...q, selected: charId, correct } : q)

    timerRef.current = setTimeout(async () => {
      const next = quizProgress + 1
      if (next >= quizTotal || !activeFamily) {
        if (activeFamily && !unlockedFamilies.has(activeFamily.id)) {
          await unlockFamily(activeFamily.id)
        }
        setStep('family-list')
        setActiveFamily(null)
      } else {
        setQuizProgress(next)
        setShakeId(null)
        const char = activeFamily!.chars[Math.floor(Math.random() * activeFamily!.chars.length)]
        const choices = buildChoices(char, allChars)
        setQuiz({ questionChar: char, choices, selected: null, correct: null })
      }
    }, 1200)
  }

  // ── Family list ───────────────────────────────────────────────────────────
  if (step === 'family-list') {
    return (
      <div className="flex flex-col pb-24 px-4 pt-6 max-w-lg mx-auto w-full">
        <div className="mb-6">
          <h1 className="font-display text-3xl font-semibold text-[var(--color-text)] tracking-tight">
            Learn
          </h1>
          <p className="font-sans text-sm text-gray-500 mt-1">
            Master consonant families one group at a time.
          </p>
        </div>

        <div className="space-y-6">
          {allGroups.map(group => {
            const families = groupedFamilies.get(group) ?? []
            const allDone = families.every(f => unlockedFamilies.has(f.id))
            const prevGroupDone = group === 1 || (groupedFamilies.get(group - 1) ?? []).every(f => unlockedFamilies.has(f.id))
            const locked = !prevGroupDone

            return (
              <div key={group}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-sans text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Group {group}
                  </span>
                  {allDone && (
                    <span className="text-xs bg-teal-100 text-teal-700 font-sans font-semibold px-2 py-0.5 rounded-full">
                      Complete
                    </span>
                  )}
                  {locked && (
                    <span className="text-xs bg-gray-100 text-gray-500 font-sans px-2 py-0.5 rounded-full">
                      Locked
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {families.map(family => {
                    const done = unlockedFamilies.has(family.id)
                    return (
                      <button
                        key={family.id}
                        onClick={() => !locked && startFamily(family)}
                        disabled={locked}
                        className={`tap-target text-left rounded-2xl border p-4 transition-all
                          ${locked
                            ? 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                            : done
                              ? 'border-teal-200 bg-teal-50 hover:shadow-md hover:shadow-teal-100'
                              : 'border-[var(--color-border)] bg-white hover:border-teal-300 hover:shadow-md'
                          }`}
                      >
                        <div className="flex items-start justify-between">
                          <span className="font-ethiopic text-3xl text-teal-700 leading-none">
                            {family.chars[0].char}
                          </span>
                          {done && (
                            <span className="w-5 h-5 rounded-full bg-teal-500 flex items-center justify-center shrink-0">
                              <svg viewBox="0 0 12 12" fill="white" className="w-3 h-3">
                                <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </span>
                          )}
                        </div>
                        <div className="mt-2">
                          <p className="font-sans font-semibold text-sm text-[var(--color-text)]">
                            {family.name}
                          </p>
                          <p className="font-sans text-xs text-gray-500 mt-0.5">
                            /{family.consonantIpa}/ · 7 forms
                          </p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  if (!activeFamily) return null

  // ── Family intro ──────────────────────────────────────────────────────────
  if (step === 'intro') {
    const baseChar = activeFamily.chars[0]
    return (
      <div className="flex flex-col items-center justify-center min-h-svh pb-24 px-6 max-w-lg mx-auto w-full">
        <div className="w-full space-y-8 text-center">
          <div>
            <p className="font-sans text-sm text-gray-400 mb-2 uppercase tracking-wider">
              New family
            </p>
            <h2 className="font-display text-3xl font-semibold text-[var(--color-text)] tracking-tight">
              The {activeFamily.name} family
            </h2>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="w-40 h-40 rounded-3xl bg-teal-50 border-2 border-teal-200 flex items-center justify-center animate-char-enter">
              <span className="font-ethiopic text-8xl text-teal-700 leading-none">
                {baseChar.char}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div>
                <p className="font-sans text-2xl font-semibold text-teal-600">
                  {baseChar.romanization}
                </p>
                <p className="font-sans text-xs text-gray-400">first order (base form)</p>
              </div>
              <AudioButton text={baseChar.romanization} language={language} size="lg" />
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-left space-y-2">
            <p className="font-sans text-sm font-semibold text-amber-800">
              The pattern
            </p>
            <p className="font-sans text-sm text-amber-900 leading-relaxed">
              This character has 7 forms — one for each vowel. The base shape stays
              the same; a small modification changes the vowel. Once you see the
              pattern, you unlock all 7 at once.
            </p>
          </div>

          <button
            onClick={goToOrders}
            className="w-full bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-sans
                       font-semibold text-base py-4 rounded-2xl transition-all shadow-md shadow-teal-200"
          >
            See all 7 forms →
          </button>
        </div>
      </div>
    )
  }

  // ── Orders reveal ─────────────────────────────────────────────────────────
  if (step === 'orders') {
    const current = activeFamily.chars[orderIndex]
    const orderInfo = VOWEL_ORDER_INFO[current.order]
    const isLast = orderIndex === activeFamily.chars.length - 1

    return (
      <div className="flex flex-col items-center justify-center min-h-svh pb-24 px-6 max-w-lg mx-auto w-full gap-8">
        <div className="text-center space-y-1">
          <h2 className="font-display text-2xl font-semibold text-[var(--color-text)] tracking-tight">
            {activeFamily.name} family
          </h2>
          <p className="font-sans text-sm text-gray-400">
            Form {orderIndex + 1} of {activeFamily.chars.length}
          </p>
        </div>

        {/* Progress dots */}
        <div className="flex gap-2">
          {activeFamily.chars.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i < orderIndex ? 'bg-teal-500 w-6' :
                i === orderIndex ? 'bg-teal-600 w-8' : 'bg-gray-200 w-4'
              }`}
            />
          ))}
        </div>

        {/* Character display */}
        <div className="flex flex-col items-center gap-6">
          <div key={current.id} className="w-48 h-48 rounded-3xl bg-teal-50 border-2 border-teal-200 flex items-center justify-center animate-char-enter">
            <span className="font-ethiopic text-9xl text-teal-700 leading-none">
              {current.char}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="font-sans text-3xl font-bold text-teal-600">
                {current.romanization}
              </p>
              <p className="font-sans text-xs text-gray-400 mt-1">
                {orderInfo.name} · vowel "{orderInfo.vowel}"
              </p>
            </div>
            <AudioButton
              text={current.romanization}
              language={language}
              size="lg"
            />
          </div>
        </div>

        {/* All 7 forms mini-row */}
        <div className="flex gap-2 flex-wrap justify-center">
          {activeFamily.chars.map((c, i) => (
            <div
              key={c.id}
              className={`flex flex-col items-center gap-1 rounded-xl p-2 transition-all ${
                i === orderIndex
                  ? 'bg-teal-600 text-white scale-110 shadow-md'
                  : i < orderIndex
                    ? 'bg-teal-50 text-teal-700'
                    : 'bg-gray-50 text-gray-300'
              }`}
            >
              <span className="font-ethiopic text-xl leading-none">{c.char}</span>
              <span className="font-sans text-[9px]">{c.romanization}</span>
            </div>
          ))}
        </div>

        <button
          onClick={nextOrder}
          className="w-full bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-sans
                     font-semibold text-base py-4 rounded-2xl transition-all shadow-md shadow-teal-200"
        >
          {isLast ? 'Take a quick quiz →' : 'Next form →'}
        </button>
      </div>
    )
  }

  // ── Quiz ──────────────────────────────────────────────────────────────────
  if (step === 'quiz' && quiz) {
    return (
      <div className="flex flex-col items-center justify-center min-h-svh pb-24 px-6 max-w-lg mx-auto w-full gap-8">
        <div className="w-full space-y-2 text-center">
          <p className="font-sans text-xs text-gray-400 uppercase tracking-wider">
            Quick check · {quizProgress + 1} of {quizTotal}
          </p>
          <h2 className="font-display text-2xl font-semibold text-[var(--color-text)] tracking-tight">
            Which character is this?
          </h2>
        </div>

        <div className="flex flex-col items-center gap-3">
          <div className="w-40 h-40 rounded-3xl bg-teal-50 border-2 border-teal-200 flex items-center justify-center">
            <span className="font-ethiopic text-8xl text-teal-700 leading-none">
              {quiz.questionChar.char}
            </span>
          </div>
          <AudioButton text={quiz.questionChar.romanization} language={language} size="md" />
        </div>

        <div className="grid grid-cols-2 gap-3 w-full">
          {quiz.choices.map(choice => {
            const isSelected = quiz.selected === choice.id
            const isCorrect = choice.id === quiz.questionChar.id
            let style = 'border-[var(--color-border)] bg-white hover:border-teal-300'
            if (isSelected && isCorrect) style = 'border-teal-500 bg-teal-50'
            if (isSelected && !isCorrect) style = 'border-red-400 bg-red-50'
            if (!isSelected && quiz.selected && isCorrect) style = 'border-teal-500 bg-teal-50'

            return (
              <button
                key={choice.id}
                onClick={() => handleQuizAnswer(choice.id)}
                disabled={!!quiz.selected}
                className={`tap-target rounded-2xl border-2 p-4 transition-all text-center
                  flex flex-col items-center gap-2 ${style}
                  ${!quiz.selected ? 'active:scale-95' : ''}
                  ${shakeId === choice.id ? 'animate-shake' : ''}`}
              >
                <span className="font-ethiopic text-4xl text-teal-700 leading-none">
                  {choice.char}
                </span>
                {quiz.selected && (
                  <span className="font-sans text-sm text-teal-600 font-medium">
                    {choice.romanization}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        <AnimatePresence>
          {quiz.selected && (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, ease: [0.25, 1, 0.5, 1] }}
              className={`w-full rounded-2xl p-4 text-center font-sans font-semibold text-base
                ${quiz.correct ? 'bg-teal-50 text-teal-700' : 'bg-red-50 text-red-700'}`}
            >
              {quiz.correct ? '✓ Correct!' : `The answer is "${quiz.questionChar.romanization}"`}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  return null
}
