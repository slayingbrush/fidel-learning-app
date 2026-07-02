import { useState, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useAppStore, useLanguage } from '../store/useAppStore'
import { useShallow } from 'zustand/react/shallow'
import { getWordsForLanguage } from '../data/words'
import { CHAR_MAP } from '../data/fidel'
import { AudioButton } from '../components/AudioButton'
import type { FidelWord } from '../data/types'

type WordPhase = 'list' | 'decoding' | 'revealed'

interface DecodeState {
  word: FidelWord
  revealed: Set<number>  // indices of tapped characters
  complete: boolean
}

export function Reading() {
  const language = useLanguage()
  const { unlockedFamilies, decodedWords, markWordDecoded } = useAppStore(
    useShallow(s => ({ unlockedFamilies: s.unlockedFamilies, decodedWords: s.decodedWords, markWordDecoded: s.markWordDecoded }))
  )

  const [phase, setPhase] = useState<WordPhase>('list')
  const [decode, setDecode] = useState<DecodeState | null>(null)
  const [tierFilter, setTierFilter] = useState<1 | 2 | 3>(1)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

  const allWords = getWordsForLanguage(language)

  // A word is available if all its characters' families are unlocked
  const isAvailable = (word: FidelWord) =>
    word.charIds.every(id => {
      const char = CHAR_MAP[id]
      return char && unlockedFamilies.has(char.familyId)
    })

  const tierWords = allWords.filter(w => w.tier === tierFilter)
  const availableWords = tierWords.filter(isAvailable)
  const lockedWords = tierWords.filter(w => !isAvailable(w))

  const startDecoding = (word: FidelWord) => {
    setDecode({ word, revealed: new Set(), complete: false })
    setPhase('decoding')
  }

  const tapChar = (index: number) => {
    if (!decode) return
    const next = new Set(decode.revealed)
    next.add(index)
    const complete = next.size === decode.word.charIds.length
    setDecode({ ...decode, revealed: next, complete })
    if (complete) {
      markWordDecoded(decode.word.id)
      timerRef.current = setTimeout(() => setPhase('revealed'), 600)
    }
  }

  const resetDecode = () => {
    setDecode(null)
    setPhase('list')
  }

  const totalDecoded = allWords.filter(w => decodedWords.has(w.id)).length

  // ── Word list ─────────────────────────────────────────────────────────────
  if (phase === 'list') {
    return (
      <div className="flex flex-col pb-24 px-4 pt-6 max-w-lg mx-auto w-full">
        <div className="mb-4">
          <h1 className="font-display text-3xl font-semibold text-[var(--color-text)] tracking-tight">
            Read
          </h1>
          <p className="font-sans text-sm text-gray-500 mt-1">
            Decode real words you already know how to say.
          </p>
        </div>

        {/* Progress pill */}
        <div className="flex items-center gap-2 mb-5">
          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-teal-500 rounded-full transition-all"
              style={{ width: `${allWords.length > 0 ? (totalDecoded / allWords.length) * 100 : 0}%` }}
            />
          </div>
          <span className="font-sans text-xs text-gray-400 shrink-0">
            {totalDecoded} / {allWords.length} decoded
          </span>
        </div>

        {/* Tier tabs */}
        <div className="flex gap-2 mb-5">
          {([1, 2, 3] as const).map(tier => (
            <button
              key={tier}
              onClick={() => setTierFilter(tier)}
              className={`flex-1 py-2 rounded-xl font-sans text-sm font-semibold transition-all tap-target
                ${tierFilter === tier
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
            >
              {tier === 1 ? '2 chars' : tier === 2 ? '3 chars' : '4+ chars'}
            </button>
          ))}
        </div>

        {/* Available words */}
        {availableWords.length > 0 && (
          <div className="mb-4">
            <p className="font-sans text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Ready to read
            </p>
            <div className="grid grid-cols-2 gap-3">
              {availableWords.map(word => {
                const done = decodedWords.has(word.id)
                return (
                  <button
                    key={word.id}
                    onClick={() => startDecoding(word)}
                    className={`tap-target text-left rounded-2xl border p-4 transition-all
                      ${done
                        ? 'border-teal-200 bg-teal-50 hover:shadow-md hover:shadow-teal-100'
                        : 'border-[var(--color-border)] bg-white hover:border-teal-300 hover:shadow-md'}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-ethiopic text-3xl text-teal-700 leading-tight">
                        {word.fidel}
                      </span>
                      {done && (
                        <span className="w-5 h-5 rounded-full bg-teal-500 flex items-center justify-center shrink-0 mt-0.5">
                          <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3">
                            <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                      )}
                    </div>
                    <p className="font-sans text-xs text-gray-500 mt-2 leading-snug">
                      {word.meaning}
                    </p>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Locked words */}
        {lockedWords.length > 0 && (
          <div>
            <p className="font-sans text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Unlock more families to read these
            </p>
            <div className="grid grid-cols-2 gap-3">
              {lockedWords.map(word => (
                <div
                  key={word.id}
                  className="rounded-2xl border border-gray-100 bg-gray-50 p-4 opacity-50"
                >
                  <span className="font-ethiopic text-3xl text-gray-400 leading-tight block">
                    {word.fidel}
                  </span>
                  <p className="font-sans text-xs text-gray-400 mt-2">
                    {word.meaning}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {availableWords.length === 0 && lockedWords.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="font-sans text-sm">No words in this tier yet.</p>
          </div>
        )}
      </div>
    )
  }

  if (!decode) return null

  const { word, revealed } = decode

  // ── Decoding ──────────────────────────────────────────────────────────────
  if (phase === 'decoding') {
    return (
      <div className="flex flex-col items-center justify-center min-h-svh pb-24 px-6 max-w-lg mx-auto w-full gap-8">
        <div className="w-full flex items-center justify-between">
          <button
            onClick={resetDecode}
            className="font-sans text-sm text-gray-400 hover:text-gray-600 transition-colors tap-target"
          >
            ← Back
          </button>
          <span className="font-sans text-xs text-gray-400 uppercase tracking-wider">
            Tap each character
          </span>
          <div className="w-10" />
        </div>

        <div className="text-center space-y-2">
          <h2 className="font-display text-2xl font-semibold text-[var(--color-text)] tracking-tight">
            Decode this word
          </h2>
          <p className="font-sans text-sm text-gray-500">
            Tap each character to reveal its sound.
          </p>
        </div>

        {/* Full word display */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-baseline gap-1">
            {word.fidel.split('').map((ch, i) => (
              <span
                key={i}
                className={`font-ethiopic transition-all ${
                  revealed.has(i)
                    ? 'text-teal-700 text-7xl'
                    : 'text-gray-300 text-7xl'
                }`}
              >
                {ch}
              </span>
            ))}
          </div>
          <p className="font-sans text-xs text-gray-400">
            {revealed.size} of {word.charIds.length} revealed
          </p>
        </div>

        {/* Individual character buttons */}
        <div className="flex gap-4 flex-wrap justify-center">
          {word.charIds.map((charId, i) => {
            const char = CHAR_MAP[charId]
            const isRevealed = revealed.has(i)
            if (!char) return null
            return (
              <button
                key={`${charId}-${i}`}
                onClick={() => !isRevealed && tapChar(i)}
                disabled={isRevealed}
                className={`tap-target flex flex-col items-center gap-2 rounded-2xl border-2 p-4
                  min-w-[5rem] transition-colors
                  ${isRevealed
                    ? 'border-teal-300 bg-teal-50 shadow-md shadow-teal-100'
                    : 'border-[var(--color-border)] bg-white hover:border-teal-300 active:scale-95'}`}
              >
                <span className="font-ethiopic text-4xl text-teal-700 leading-none">
                  {char.char}
                </span>
                <AnimatePresence mode="wait">
                  {isRevealed ? (
                    <motion.div
                      key="revealed"
                      initial={{ opacity: 0, scale: 0.82 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2, ease: [0.25, 1, 0.5, 1] }}
                      className="flex flex-col items-center gap-1"
                    >
                      <span className="font-sans text-sm font-semibold text-teal-600">
                        {char.romanization}
                      </span>
                      <AudioButton text={char.romanization} language={language} size="sm" />
                    </motion.div>
                  ) : (
                    <motion.span key="hint" className="font-sans text-xs text-gray-300">tap</motion.span>
                  )}
                </AnimatePresence>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  // ── Revealed ──────────────────────────────────────────────────────────────
  if (phase === 'revealed') {
    return (
      <div className="flex flex-col items-center justify-center min-h-svh pb-24 px-6 max-w-lg mx-auto w-full gap-8">
        <div className="text-center space-y-3">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
            className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mx-auto"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-8 h-8 text-teal-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.26, delay: 0.1, ease: [0.25, 1, 0.5, 1] }}
            className="font-display text-3xl font-semibold text-[var(--color-text)] tracking-tight"
          >
            You read it!
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32, delay: 0.18, ease: [0.25, 1, 0.5, 1] }}
          className="w-full bg-teal-50 border border-teal-200 rounded-3xl p-6 text-center space-y-4"
        >
          <span className="font-ethiopic text-7xl text-teal-700 block leading-tight">
            {word.fidel}
          </span>
          <div className="space-y-1">
            <p className="font-sans text-2xl font-semibold text-teal-600">
              {word.romanization}
            </p>
            <p className="font-sans text-base text-teal-700">
              {word.meaning}
            </p>
          </div>
          <AudioButton
            text={word.romanization}
            language={language}
            size="lg"
            label={`Hear ${word.romanization}`}
          />
        </motion.div>

        {/* Character breakdown */}
        <div className="w-full space-y-2">
          <p className="font-sans text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Character breakdown
          </p>
          <div className="flex gap-2 flex-wrap">
            {word.charIds.map((charId, i) => {
              const char = CHAR_MAP[charId]
              if (!char) return null
              return (
                <div key={i} className="flex flex-col items-center gap-1 bg-white border border-[var(--color-border)] rounded-xl px-3 py-2">
                  <span className="font-ethiopic text-2xl text-teal-700 leading-none">{char.char}</span>
                  <span className="font-sans text-xs text-gray-500">{char.romanization}</span>
                </div>
              )
            })}
            <div className="flex items-center px-3">
              <span className="font-sans text-gray-300 text-xl">=</span>
            </div>
            <div className="flex flex-col items-center gap-1 bg-teal-50 border border-teal-200 rounded-xl px-3 py-2">
              <span className="font-ethiopic text-2xl text-teal-700 leading-none">{word.fidel}</span>
              <span className="font-sans text-xs text-teal-600 font-semibold">{word.romanization}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={resetDecode}
            className="w-full bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-sans
                       font-semibold text-base py-4 rounded-2xl transition-all shadow-md shadow-teal-200"
          >
            Read another word
          </button>
          <button
            onClick={() => { setDecode({ ...decode, revealed: new Set(), complete: false }); setPhase('decoding') }}
            className="w-full text-teal-600 hover:text-teal-700 font-sans font-medium text-base py-3 transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  return null
}
