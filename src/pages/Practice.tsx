import { useState, useEffect, useCallback, useRef } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useAppStore, useLanguage, useUnlockedChars } from '../store/useAppStore'
import { useShallow } from 'zustand/react/shallow'
import { buildReviewQueue, buildChoices, getQueueStats, checkTypedAnswer, normalizeRomanization } from '../srs/queue'
import { AudioButton } from '../components/AudioButton'
import type { FidelChar } from '../data/types'
import { getCharsForLanguage } from '../data/fidel'

type SessionPhase = 'summary' | 'reviewing' | 'complete'

interface ActiveCard {
  char: FidelChar
  mode: 'char-to-sound' | 'sound-to-char' | 'type-sound'
  choices: FidelChar[]
  selected: string | null
  correct: boolean | null
}

export function Practice() {
  const language = useLanguage()
  const unlockedChars = useUnlockedChars()
  const { cardStates, reviewCard } = useAppStore(
    useShallow(s => ({ cardStates: s.cardStates, reviewCard: s.reviewCard }))
  )
  const allChars = getCharsForLanguage(language)

  const [phase, setPhase]               = useState<SessionPhase>('summary')
  const [queue, setQueue]               = useState<ReturnType<typeof buildReviewQueue>>([])
  const [queueIndex, setQueueIndex]     = useState(0)
  const [activeCard, setActiveCard]     = useState<ActiveCard | null>(null)
  const [sessionCorrect, setSessionCorrect] = useState(0)
  const [sessionTotal, setSessionTotal]     = useState(0)
  const [autoPlayed, setAutoPlayed]         = useState(false)
  const [typeInput, setTypeInput]           = useState('')
  const [typeSubmitted, setTypeSubmitted]   = useState(false)
  const timerRef   = useRef<ReturnType<typeof setTimeout> | null>(null)
  const inputRef   = useRef<HTMLInputElement>(null)

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

  const stats = getQueueStats(unlockedChars, cardStates)

  const buildActive = useCallback((item: ReturnType<typeof buildReviewQueue>[0]): ActiveCard => ({
    char: item.char,
    mode: item.mode,
    choices: item.mode !== 'type-sound' ? buildChoices(item.char, allChars) : [],
    selected: null,
    correct: null,
  }), [allChars])

  const advanceQueue = useCallback((currentIndex: number, currentQueue: typeof queue) => {
    const next = currentIndex + 1
    if (next >= currentQueue.length) {
      setPhase('complete')
    } else {
      setQueueIndex(next)
      setActiveCard(buildActive(currentQueue[next]))
      setTypeInput('')
      setTypeSubmitted(false)
      setAutoPlayed(false)
    }
  }, [buildActive])

  const startSession = () => {
    const q = buildReviewQueue(unlockedChars, cardStates)
    setQueue(q)
    setQueueIndex(0)
    setSessionCorrect(0)
    setSessionTotal(0)
    setTypeInput('')
    setTypeSubmitted(false)
    setAutoPlayed(false)
    if (q.length > 0) {
      setActiveCard(buildActive(q[0]))
      setPhase('reviewing')
    }
  }

  // Multiple-choice answer handler
  const handleChoiceAnswer = async (choiceId: string) => {
    if (!activeCard || activeCard.selected) return
    const correct = choiceId === activeCard.char.id
    setActiveCard(c => c ? { ...c, selected: choiceId, correct } : c)
    setSessionTotal(t => t + 1)
    if (correct) setSessionCorrect(c => c + 1)
    await reviewCard(activeCard.char.id, correct ? 4 : 1)
    timerRef.current = setTimeout(() => advanceQueue(queueIndex, queue), 1100)
  }

  // Free-recall typing handler
  const handleTypeAnswer = async () => {
    if (!activeCard || typeSubmitted || !typeInput.trim()) return
    const correct = checkTypedAnswer(typeInput, activeCard.char.romanization)
    setTypeSubmitted(true)
    setActiveCard(c => c ? { ...c, selected: 'typed', correct } : c)
    setSessionTotal(t => t + 1)
    if (correct) setSessionCorrect(c => c + 1)
    await reviewCard(activeCard.char.id, correct ? 4 : 1)
    // Give more time on wrong answers so the correction registers
    timerRef.current = setTimeout(() => advanceQueue(queueIndex, queue), correct ? 1000 : 2000)
  }

  useEffect(() => {
    if (activeCard?.mode === 'sound-to-char' && !autoPlayed) {
      setAutoPlayed(true)
    }
    if (activeCard?.mode === 'type-sound' && !typeSubmitted) {
      // Focus input when type-sound card appears
      timerRef.current = setTimeout(() => inputRef.current?.focus(), 80)
    }
  }, [activeCard, autoPlayed, typeSubmitted])

  const accuracy = sessionTotal > 0 ? Math.round((sessionCorrect / sessionTotal) * 100) : 0

  // ── Summary ───────────────────────────────────────────────────────────────
  if (phase === 'summary') {
    return (
      <div className="flex flex-col pb-24 md:pb-8 px-4 pt-6 max-w-lg mx-auto w-full">
        <div className="mb-6">
          <h1 className="font-display text-3xl font-semibold text-[var(--color-text)] tracking-tight">
            Practice
          </h1>
          <p className="font-sans text-sm text-gray-500 mt-1">
            Spaced repetition keeps characters fresh.
          </p>
        </div>

        <div className={`rounded-2xl p-5 mb-6 ${
          stats.dueToday > 0 ? 'bg-teal-600 text-white' : 'bg-teal-50 border border-teal-100'
        }`}>
          <p className={`font-sans text-sm font-medium ${stats.dueToday > 0 ? 'text-teal-100' : 'text-teal-600'}`}>
            Due for review
          </p>
          <p className={`font-display text-5xl font-semibold tracking-tight mt-1 ${
            stats.dueToday > 0 ? 'text-white' : 'text-teal-700'
          }`}>
            {stats.dueToday}
          </p>
          <p className={`font-sans text-sm mt-1 ${stats.dueToday > 0 ? 'text-teal-100' : 'text-teal-500'}`}>
            {stats.dueToday === 0
              ? 'All caught up! Check back later.'
              : `characters waiting · ${stats.total} total unlocked`}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'New',      count: stats.new,      color: 'text-gray-600',  bg: 'bg-gray-50 border-gray-100' },
            { label: 'Learning', count: stats.learning, color: 'text-amber-700', bg: 'bg-amber-50 border-amber-100' },
            { label: 'Mastered', count: stats.mastered, color: 'text-teal-700',  bg: 'bg-teal-50 border-teal-100' },
          ].map(s => (
            <div key={s.label} className={`rounded-2xl border p-4 text-center ${s.bg}`}>
              <p className={`font-display text-3xl font-semibold ${s.color}`}>{s.count}</p>
              <p className={`font-sans text-xs font-medium mt-0.5 ${s.color}`}>{s.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-white border border-[var(--color-border)] rounded-2xl p-4 mb-6 space-y-2">
          <p className="font-sans text-xs font-semibold text-gray-400 uppercase tracking-wider">Quiz types</p>
          {[
            ['See character → pick sound', 'Recognition (easier)'],
            ['Hear sound → pick character', 'Audio identification'],
            ['See character → type sound', 'Free recall (most effective)'],
          ].map(([title, badge]) => (
            <div key={title} className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-400 shrink-0" />
              <span className="font-sans text-sm text-[var(--color-text)]">{title}</span>
              <span className="ml-auto font-sans text-xs text-teal-600 font-medium shrink-0">{badge}</span>
            </div>
          ))}
        </div>

        <button
          onClick={startSession}
          disabled={stats.dueToday === 0}
          className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed
                     active:scale-95 text-white font-sans font-semibold text-base py-4 rounded-2xl
                     transition-all shadow-md shadow-teal-200 disabled:shadow-none"
        >
          {stats.dueToday > 0 ? `Start review (${stats.dueToday} cards)` : 'Nothing due right now'}
        </button>
      </div>
    )
  }

  // ── Complete ──────────────────────────────────────────────────────────────
  if (phase === 'complete') {
    return (
      <div className="flex flex-col items-center justify-center min-h-svh pb-24 md:pb-8 px-6 max-w-lg mx-auto w-full gap-8">
        <div className="text-center space-y-2">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
            className="w-20 h-20 rounded-full bg-teal-100 flex items-center justify-center mx-auto"
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10 text-teal-600" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, delay: 0.12, ease: [0.25, 1, 0.5, 1] }}
            className="font-display text-3xl font-semibold text-[var(--color-text)] tracking-tight"
          >
            Session done!
          </motion.h2>
          <p className="font-sans text-gray-500">{sessionTotal} cards reviewed</p>
        </div>

        <div className="w-full bg-white rounded-2xl border border-[var(--color-border)] divide-y divide-[var(--color-border)]">
          {[
            ['Accuracy', `${accuracy}%`],
            ['Correct', `${sessionCorrect} / ${sessionTotal}`],
          ].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between px-5 py-4">
              <span className="font-sans text-sm text-gray-500">{label}</span>
              <span className="font-sans font-semibold text-[var(--color-text)]">{value}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={startSession}
            className="w-full bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-sans
                       font-semibold text-base py-4 rounded-2xl transition-all shadow-md shadow-teal-200"
          >
            Review again
          </button>
          <button
            onClick={() => setPhase('summary')}
            className="w-full text-teal-600 hover:text-teal-700 font-sans font-medium text-base
                       py-3 transition-colors"
          >
            Back to summary
          </button>
        </div>
      </div>
    )
  }

  // ── Reviewing ─────────────────────────────────────────────────────────────
  if (!activeCard) return null

  const progress = queueIndex / queue.length

  return (
    <div className="flex flex-col items-center min-h-svh pb-24 md:pb-8 px-6 pt-6 max-w-lg mx-auto w-full gap-6">
      {/* Progress bar */}
      <div className="w-full">
        <div className="flex justify-between items-center mb-2">
          <span className="font-sans text-xs text-gray-400">{queueIndex + 1} / {queue.length}</span>
          <button
            onClick={() => {
              if (timerRef.current) clearTimeout(timerRef.current)
              setPhase('summary')
            }}
            className="font-sans text-xs text-gray-400 hover:text-gray-600 transition-colors tap-target"
          >
            Exit
          </button>
        </div>
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-teal-500 rounded-full transition-all duration-500"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeCard.char.id + activeCard.mode}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.18, ease: [0.25, 1, 0.5, 1] }}
          className="flex flex-col items-center gap-6 w-full"
        >

          {/* ── Type-sound mode ─────────────────────────────── */}
          {activeCard.mode === 'type-sound' && (
            <>
              <p className="font-sans text-xs text-gray-400 uppercase tracking-wider self-start">
                Type what you hear
              </p>
              <div className="flex flex-col items-center gap-4">
                <div className="w-44 h-44 rounded-3xl bg-teal-50 border-2 border-teal-200 flex items-center justify-center">
                  <span className="font-ethiopic text-8xl text-teal-700 leading-none">
                    {activeCard.char.char}
                  </span>
                </div>
                <AudioButton text={activeCard.char.romanization} language={language} size="md" />
              </div>

              <div className="w-full space-y-3">
                <input
                  ref={inputRef}
                  type="text"
                  value={typeInput}
                  onChange={e => !typeSubmitted && setTypeInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') void handleTypeAnswer() }}
                  disabled={typeSubmitted}
                  placeholder="Type the sound (e.g. ha, mi, lo…)"
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  className={`w-full font-sans text-lg text-[var(--color-text)] border-2 rounded-2xl
                    px-5 py-4 outline-none transition-colors
                    ${typeSubmitted
                      ? activeCard.correct
                        ? 'border-teal-500 bg-teal-50 text-teal-700'
                        : 'border-red-400 bg-red-50 text-red-700'
                      : 'border-[var(--color-border)] bg-white focus:border-teal-500'
                    }`}
                />
                {!typeSubmitted && (
                  <button
                    onClick={() => void handleTypeAnswer()}
                    disabled={!typeInput.trim()}
                    className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed
                               active:scale-95 text-white font-sans font-semibold text-base py-4 rounded-2xl
                               transition-all"
                  >
                    Check
                  </button>
                )}
                {typeSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`rounded-2xl p-4 font-sans ${
                      activeCard.correct ? 'bg-teal-50 text-teal-700' : 'bg-red-50 text-red-700'
                    }`}
                  >
                    <p className="font-semibold">
                      {activeCard.correct ? '✓ Correct!' : '✗ Not quite'}
                    </p>
                    {!activeCard.correct && (
                      <p className="text-sm mt-1">
                        The answer is <span className="font-bold">{activeCard.char.romanization}</span>
                        {normalizeRomanization(activeCard.char.romanization) !== activeCard.char.romanization && (
                          <span className="text-red-500"> (you can type "{normalizeRomanization(activeCard.char.romanization)}")</span>
                        )}
                      </p>
                    )}
                  </motion.div>
                )}
              </div>
            </>
          )}

          {/* ── Multiple-choice modes ────────────────────────── */}
          {activeCard.mode !== 'type-sound' && (
            <>
              <p className="font-sans text-xs text-gray-400 uppercase tracking-wider self-start">
                {activeCard.mode === 'char-to-sound' ? 'What sound is this?' : 'Find this character'}
              </p>

              {activeCard.mode === 'char-to-sound' ? (
                <div className="w-44 h-44 rounded-3xl bg-teal-50 border-2 border-teal-200 flex items-center justify-center">
                  <span className="font-ethiopic text-8xl text-teal-700 leading-none">
                    {activeCard.char.char}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-44 h-44 rounded-3xl bg-amber-50 border-2 border-amber-200 flex items-center justify-center">
                    <span className="font-sans text-4xl font-bold text-amber-700">
                      {activeCard.char.romanization}
                    </span>
                  </div>
                  <AudioButton text={activeCard.char.romanization} language={language} size="lg" label="Hear the sound" />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 w-full">
                {activeCard.choices.map(choice => {
                  const isSelected = activeCard.selected === choice.id
                  const isCorrect  = choice.id === activeCard.char.id
                  let style = 'border-[var(--color-border)] bg-white hover:border-teal-300 hover:shadow-sm'
                  if (isSelected && isCorrect)  style = 'border-teal-500 bg-teal-50'
                  if (isSelected && !isCorrect) style = 'border-red-400 bg-red-50'
                  if (!isSelected && activeCard.selected && isCorrect) style = 'border-teal-500 bg-teal-50'

                  return (
                    <button
                      key={choice.id}
                      onClick={() => void handleChoiceAnswer(choice.id)}
                      disabled={!!activeCard.selected}
                      className={`tap-target rounded-2xl border-2 p-4 transition-all flex flex-col items-center gap-2
                        ${style} ${!activeCard.selected ? 'active:scale-95' : ''}`}
                    >
                      {activeCard.mode === 'char-to-sound' ? (
                        <>
                          <span className="font-sans font-semibold text-xl text-[var(--color-text)]">
                            {choice.romanization}
                          </span>
                          <span className="font-sans text-xs text-gray-400">/{choice.ipa}/</span>
                        </>
                      ) : (
                        <span className="font-ethiopic text-4xl text-teal-700 leading-none">
                          {choice.char}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>

              <AnimatePresence>
                {activeCard.selected && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.22, ease: [0.25, 1, 0.5, 1] }}
                    className={`w-full rounded-2xl p-4 flex items-center gap-3 font-sans font-semibold
                      ${activeCard.correct ? 'bg-teal-50 text-teal-700' : 'bg-red-50 text-red-700'}`}
                  >
                    <span className="text-xl">{activeCard.correct ? '✓' : '✗'}</span>
                    <div>
                      <p>{activeCard.correct ? 'Correct!' : 'Not quite'}</p>
                      {!activeCard.correct && (
                        <p className="font-normal text-sm mt-0.5">
                          {activeCard.char.char} = {activeCard.char.romanization}
                        </p>
                      )}
                    </div>
                    <div className="ml-auto">
                      <AudioButton text={activeCard.char.romanization} language={language} size="sm" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
