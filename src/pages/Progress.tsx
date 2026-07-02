import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppStore, useLanguage } from '../store/useAppStore'
import { useShallow } from 'zustand/react/shallow'
import { getFamiliesForLanguage } from '../data/fidel'
import { getWordsForLanguage } from '../data/words'
import { masteryLevel, daysUntilReview } from '../srs/sm2'
import { FidelGrid } from '../components/FidelGrid'
import type { FidelChar } from '../data/types'

type Tab = 'grid' | 'stats'

export function Progress() {
  const language = useLanguage()
  const { cardStates, unlockedFamilies, decodedWords, profile } = useAppStore(
    useShallow(s => ({ cardStates: s.cardStates, unlockedFamilies: s.unlockedFamilies, decodedWords: s.decodedWords, profile: s.profile }))
  )

  const [tab, setTab] = useState<Tab>('grid')
  const [selectedChar, setSelectedChar] = useState<FidelChar | null>(null)

  const families = getFamiliesForLanguage(language)
  const allChars = families.flatMap(f => f.chars)
  const allWords = getWordsForLanguage(language)

  const masteredCount = allChars.filter(c => {
    const card = cardStates[c.id]
    return card && masteryLevel(card) === 'mastered'
  }).length

  const learningCount = allChars.filter(c => {
    const card = cardStates[c.id]
    return card && masteryLevel(card) === 'learning'
  }).length

  const unlockedCount = allChars.filter(c => unlockedFamilies.has(c.familyId)).length
  const totalChars = allChars.length
  const decodedCount = allWords.filter(w => decodedWords.has(w.id)).length
  const masteryPct = totalChars > 0 ? Math.round((masteredCount / totalChars) * 100) : 0

  return (
    <div className="flex flex-col pb-24 px-4 pt-6 max-w-lg mx-auto w-full">
      {/* Header */}
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-display text-3xl font-semibold text-[var(--color-text)] tracking-tight">
            Progress
          </h1>
          {profile?.name && (
            <p className="font-sans text-sm text-gray-500 mt-1 truncate max-w-[18rem]">{profile.name}</p>
          )}
        </div>
        <Link
          to="/settings"
          aria-label="Settings"
          className="tap-target flex items-center justify-center w-10 h-10 rounded-xl
                     text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors shrink-0 mt-0.5"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </Link>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="rounded-2xl bg-teal-600 p-4 text-white">
          <p className="font-display text-4xl font-semibold">{masteryPct}%</p>
          <p className="font-sans text-sm text-teal-100 mt-1">Script mastered</p>
        </div>
        <div className="rounded-2xl bg-white border border-[var(--color-border)] p-4">
          <p className="font-display text-4xl font-semibold text-teal-700">{masteredCount}</p>
          <p className="font-sans text-sm text-gray-500 mt-1">Characters mastered</p>
        </div>
        <div className="rounded-2xl bg-white border border-[var(--color-border)] p-4">
          <p className="font-display text-4xl font-semibold text-amber-600">{learningCount}</p>
          <p className="font-sans text-sm text-gray-500 mt-1">Still learning</p>
        </div>
        <div className="rounded-2xl bg-white border border-[var(--color-border)] p-4">
          <p className="font-display text-4xl font-semibold text-teal-700">{decodedCount}</p>
          <p className="font-sans text-sm text-gray-500 mt-1">Words decoded</p>
        </div>
      </div>

      {/* Overall progress bar */}
      <div className="mb-5 bg-white border border-[var(--color-border)] rounded-2xl p-4 space-y-3">
        <div className="flex justify-between items-center">
          <span className="font-sans text-sm font-semibold text-[var(--color-text)]">
            Fidel grid coverage
          </span>
          <span className="font-sans text-sm text-gray-500">
            {unlockedCount} / {totalChars} unlocked
          </span>
        </div>
        {/* Stacked bar: mastered | learning | unlocked-not-yet | locked */}
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden flex">
          <div
            className="h-full bg-teal-500 transition-all duration-700"
            style={{ width: `${(masteredCount / totalChars) * 100}%` }}
          />
          <div
            className="h-full bg-amber-400 transition-all duration-700"
            style={{ width: `${(learningCount / totalChars) * 100}%` }}
          />
          <div
            className="h-full bg-teal-100 transition-all duration-700"
            style={{ width: `${(Math.max(0, unlockedCount - masteredCount - learningCount) / totalChars) * 100}%` }}
          />
        </div>
        <div className="flex gap-4">
          {[
            { color: 'bg-teal-500', label: 'Mastered' },
            { color: 'bg-amber-400', label: 'Learning' },
            { color: 'bg-gray-200', label: 'Locked' },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
              <span className="font-sans text-xs text-gray-500">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        {(['grid', 'stats'] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-xl font-sans text-sm font-semibold transition-all tap-target capitalize
              ${tab === t
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
          >
            {t === 'grid' ? 'Fidel grid' : 'Details'}
          </button>
        ))}
      </div>

      {/* Grid tab */}
      {tab === 'grid' && (
        <div className="space-y-4">
          <p className="font-sans text-xs text-gray-400">
            Tap a character to see its details. Teal = mastered · Amber = learning · Gray = locked.
          </p>
          <div className="bg-white rounded-2xl border border-[var(--color-border)] p-4 overflow-x-auto">
            <FidelGrid
              families={families}
              cardStates={cardStates}
              onCharClick={charId => {
                const char = families.flatMap(f => f.chars).find(c => c.id === charId)
                setSelectedChar(char ?? null)
              }}
            />
          </div>

          {/* Character detail panel */}
          {selectedChar && (() => {
            const card = cardStates[selectedChar.id]
            const level = card ? masteryLevel(card) : 'new'
            const days = card ? daysUntilReview(card) : 0
            return (
              <div className="bg-white rounded-2xl border border-[var(--color-border)] p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <span className="font-ethiopic text-5xl text-teal-700 leading-none">
                      {selectedChar.char}
                    </span>
                    <div>
                      <p className="font-sans font-semibold text-lg text-[var(--color-text)]">
                        {selectedChar.romanization}
                      </p>
                      <p className="font-sans text-xs text-gray-400">/{selectedChar.ipa}/</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedChar(null)}
                    className="tap-target text-gray-300 hover:text-gray-500 transition-colors text-xl leading-none"
                  >
                    ×
                  </button>
                </div>

                <div className="flex gap-3">
                  <span className={`font-sans text-xs font-semibold px-3 py-1 rounded-full
                    ${level === 'mastered' ? 'bg-teal-100 text-teal-700'
                    : level === 'learning' ? 'bg-amber-100 text-amber-700'
                    : 'bg-gray-100 text-gray-500'}`}>
                    {level === 'new' ? 'Not started' : level.charAt(0).toUpperCase() + level.slice(1)}
                  </span>
                  {card && (
                    <span className="font-sans text-xs text-gray-400 self-center">
                      {days === 0 ? 'Due now' : `Next review in ${days}d`}
                    </span>
                  )}
                </div>

                {card && (
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {[
                      ['Repetitions', card.repetitions],
                      ['Interval', `${card.interval}d`],
                      ['Ease factor', card.ef.toFixed(2)],
                    ].map(([label, value]) => (
                      <div key={label as string} className="bg-gray-50 rounded-xl p-3">
                        <p className="font-sans text-xs text-gray-400">{label}</p>
                        <p className="font-sans font-semibold text-[var(--color-text)] mt-0.5">{value}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })()}
        </div>
      )}

      {/* Stats tab */}
      {tab === 'stats' && (
        <div className="space-y-4">
          {families.map(family => {
            const mastered = family.chars.filter(c => {
              const card = cardStates[c.id]
              return card && masteryLevel(card) === 'mastered'
            }).length
            const unlocked = unlockedFamilies.has(family.id)
            if (!unlocked) return null
            return (
              <div key={family.id} className="bg-white rounded-2xl border border-[var(--color-border)] p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-ethiopic text-3xl text-teal-700 leading-none">
                      {family.chars[0].char}
                    </span>
                    <div>
                      <p className="font-sans font-semibold text-sm text-[var(--color-text)]">
                        {family.name} family
                      </p>
                      <p className="font-sans text-xs text-gray-400">
                        /{family.consonantIpa}/ · {mastered}/7 mastered
                      </p>
                    </div>
                  </div>
                  {mastered === 7 && (
                    <span className="w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center">
                      <svg viewBox="0 0 12 12" fill="none" className="w-3.5 h-3.5">
                        <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  )}
                </div>
                <div className="flex gap-1">
                  {family.chars.map(char => {
                    const card = cardStates[char.id]
                    const level = card ? masteryLevel(card) : 'new'
                    return (
                      <div
                        key={char.id}
                        title={char.romanization}
                        className={`flex-1 h-1.5 rounded-full transition-all
                          ${level === 'mastered' ? 'bg-teal-500'
                          : level === 'learning' ? 'bg-amber-400'
                          : 'bg-gray-200'}`}
                      />
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
