import { useState, useMemo } from 'react'
import { useAppStore, useLanguage } from '../store/useAppStore'
import { useShallow } from 'zustand/react/shallow'
import { getFamiliesForLanguage } from '../data/fidel'
import type { ConsonantFamily } from '../data/types'

type SheetType = 'family' | 'recognition' | 'production'

const SHEET_DESCRIPTIONS: Record<SheetType, { title: string; desc: string; instruction: string }> = {
  family: {
    title: 'Family Reference',
    desc: 'All 7 forms of one family — trace and copy each character',
    instruction: 'Trace the gray characters, then copy them in the blank boxes. Say each sound aloud as you write.',
  },
  recognition: {
    title: 'Recognition Drill',
    desc: 'See the character, write its sound',
    instruction: 'Write the romanization (sound) next to each character. Cover the answer column and self-check.',
  },
  production: {
    title: 'Production Drill',
    desc: 'See the sound, write the character',
    instruction: 'Write the Ethiopic character next to each romanization. This is the hardest exercise — highest retention.',
  },
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function FamilySheet({ family }: { family: ConsonantFamily }) {
  return (
    <div className="print-sheet space-y-6">
      <div className="border-b-2 border-gray-800 pb-3 mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          The {family.name} family — /{family.consonantIpa}/
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          {SHEET_DESCRIPTIONS.family.instruction}
        </p>
      </div>

      <div className="grid grid-cols-7 gap-3">
        {family.chars.map((char, i) => (
          <div key={char.id} className="flex flex-col items-center gap-1">
            <div className="text-xs text-gray-400 font-mono">order {i + 1}</div>
            {/* Trace copy (light) */}
            <div className="w-14 h-14 border border-gray-200 rounded-lg flex items-center justify-center">
              <span className="font-ethiopic text-3xl text-gray-200 select-none">{char.char}</span>
            </div>
            <div className="text-xs text-gray-500 text-center font-mono">{char.romanization}</div>
          </div>
        ))}
      </div>

      {/* Copy rows */}
      {[1, 2, 3].map(row => (
        <div key={row}>
          <div className="text-xs text-gray-400 mb-1 font-medium">Copy row {row}</div>
          <div className="grid grid-cols-7 gap-3">
            {family.chars.map(char => (
              <div key={char.id} className="w-14 h-14 border-2 border-dashed border-gray-300 rounded-lg" />
            ))}
          </div>
        </div>
      ))}

      {/* Mini sentences / notes area */}
      <div className="mt-6 border-t border-gray-200 pt-4">
        <div className="text-xs text-gray-400 font-medium mb-2">Notes / example words</div>
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-8 border-b border-gray-200" />
          ))}
        </div>
      </div>
    </div>
  )
}

function RecognitionSheet({ chars }: { chars: ConsonantFamily['chars'] }) {
  return (
    <div className="print-sheet">
      <div className="border-b-2 border-gray-800 pb-3 mb-6">
        <h2 className="text-xl font-bold text-gray-900">Recognition Drill</h2>
        <p className="text-sm text-gray-600 mt-1">{SHEET_DESCRIPTIONS.recognition.instruction}</p>
      </div>

      <div className="grid grid-cols-2 gap-x-8 gap-y-0">
        {chars.map((char, i) => (
          <div key={char.id} className="flex items-center gap-4 py-2 border-b border-gray-100">
            <span className="w-6 text-xs text-gray-300 shrink-0">{i + 1}</span>
            <span className="font-ethiopic text-2xl text-gray-900 w-8 shrink-0">{char.char}</span>
            <div className="flex-1 border-b-2 border-gray-800 h-6 relative">
              {/* Answer key — fold page here */}
              <span className="absolute right-1 bottom-1 text-xs text-gray-200 select-none">
                {char.romanization}
              </span>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400 mt-6 italic">
        Tip: fold the right edge under to hide the answer key while drilling.
      </p>
    </div>
  )
}

function ProductionSheet({ chars }: { chars: ConsonantFamily['chars'] }) {
  return (
    <div className="print-sheet">
      <div className="border-b-2 border-gray-800 pb-3 mb-6">
        <h2 className="text-xl font-bold text-gray-900">Production Drill</h2>
        <p className="text-sm text-gray-600 mt-1">{SHEET_DESCRIPTIONS.production.instruction}</p>
      </div>

      <div className="grid grid-cols-2 gap-x-8 gap-y-0">
        {chars.map((char, i) => (
          <div key={char.id} className="flex items-center gap-4 py-2 border-b border-gray-100">
            <span className="w-6 text-xs text-gray-300 shrink-0">{i + 1}</span>
            <span className="font-mono text-sm text-gray-700 w-10 shrink-0 font-semibold">
              {char.romanization}
            </span>
            <div className="flex-1 border-b-2 border-gray-800 h-8 relative">
              <span className="absolute right-1 bottom-1 font-ethiopic text-lg text-gray-200 select-none">
                {char.char}
              </span>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400 mt-6 italic">
        Tip: fold the right edge under to hide the answer key. Production is hardest — it builds the deepest memory.
      </p>
    </div>
  )
}

export function Sheets() {
  const language = useLanguage()
  const { unlockedFamilies } = useAppStore(
    useShallow(s => ({ unlockedFamilies: s.unlockedFamilies }))
  )

  const allFamilies = getFamiliesForLanguage(language)
  const unlocked = allFamilies.filter(f => unlockedFamilies.has(f.id))

  const [sheetType, setSheetType]       = useState<SheetType>('family')
  const [selectedFamily, setSelectedFamily] = useState<ConsonantFamily | null>(unlocked[0] ?? null)
  const [shuffled, setShuffled]         = useState(false)

  const sheetChars = useMemo(() => {
    if (!selectedFamily) return []
    const base = selectedFamily.chars
    return shuffled ? shuffle([...base]) : base
  }, [selectedFamily, shuffled])

  const allUnlockedChars = useMemo(() => {
    const chars = unlocked.flatMap(f => f.chars)
    return shuffled ? shuffle(chars) : chars
  }, [unlocked, shuffled])

  const displayChars = sheetType === 'family' ? sheetChars : allUnlockedChars.slice(0, 30)

  if (unlocked.length === 0) {
    return (
      <div className="flex flex-col pb-24 md:pb-8 px-4 pt-6 max-w-lg mx-auto w-full">
        <h1 className="font-display text-3xl font-semibold text-[var(--color-text)] tracking-tight mb-4">
          Study Sheets
        </h1>
        <div className="bg-gray-50 rounded-2xl border border-gray-100 p-8 text-center">
          <p className="font-sans text-gray-500">
            Unlock some characters in Learn mode first, then come back here for printable practice sheets.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col pb-24 md:pb-8 px-4 pt-6 max-w-2xl mx-auto w-full">

      {/* Controls — hidden when printing */}
      <div className="no-print mb-6">
        <div className="mb-6">
          <h1 className="font-display text-3xl font-semibold text-[var(--color-text)] tracking-tight">
            Study Sheets
          </h1>
          <p className="font-sans text-sm text-gray-500 mt-1">
            Pen-and-paper exercises to reinforce what you learn in the app.
          </p>
        </div>

        {/* Sheet type */}
        <div className="space-y-3 mb-5">
          <h2 className="font-sans text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Sheet type
          </h2>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {(Object.entries(SHEET_DESCRIPTIONS) as [SheetType, typeof SHEET_DESCRIPTIONS[SheetType]][]).map(([type, info]) => (
              <button
                key={type}
                onClick={() => setSheetType(type)}
                className={`tap-target text-left rounded-2xl border-2 p-4 transition-all
                  ${sheetType === type
                    ? 'border-teal-500 bg-teal-50'
                    : 'border-[var(--color-border)] bg-white hover:border-teal-300'}`}
              >
                <p className={`font-sans text-sm font-semibold ${sheetType === type ? 'text-teal-700' : 'text-[var(--color-text)]'}`}>
                  {info.title}
                </p>
                <p className={`font-sans text-xs mt-0.5 leading-snug ${sheetType === type ? 'text-teal-600' : 'text-gray-400'}`}>
                  {info.desc}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Family picker — only for family sheet */}
        {sheetType === 'family' && (
          <div className="space-y-3 mb-5">
            <h2 className="font-sans text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Family
            </h2>
            <div className="flex flex-wrap gap-2">
              {unlocked.map(family => (
                <button
                  key={family.id}
                  onClick={() => setSelectedFamily(family)}
                  className={`tap-target rounded-xl border-2 px-4 py-2 transition-all font-sans text-sm font-medium
                    ${selectedFamily?.id === family.id
                      ? 'border-teal-500 bg-teal-50 text-teal-700'
                      : 'border-[var(--color-border)] bg-white text-gray-600 hover:border-teal-300'}`}
                >
                  <span className="font-ethiopic text-base mr-2">{family.chars[0].char}</span>
                  {family.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Options */}
        <div className="flex items-center justify-between mb-5">
          <label className="flex items-center gap-3 cursor-pointer tap-target">
            <input
              type="checkbox"
              checked={shuffled}
              onChange={e => setShuffled(e.target.checked)}
              className="w-4 h-4 accent-teal-600"
            />
            <span className="font-sans text-sm text-gray-600">Shuffle order</span>
          </label>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 active:scale-95
                       text-white font-sans font-semibold text-sm px-5 py-3 rounded-xl
                       transition-all shadow-md shadow-teal-200"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print sheet
          </button>
        </div>

        {/* Learning tip */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-900 leading-relaxed">
          <p className="font-semibold mb-1">Why pen and paper?</p>
          Writing by hand activates different neural pathways than tapping a screen. Research shows handwriting
          improves long-term retention by 25–50% compared to typing alone. Use these sheets between app sessions
          for the fastest progress.
        </div>
      </div>

      {/* ── Print header (only visible when printing) ── */}
      <div className="print-only mb-6 border-b-2 border-gray-900 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-ethiopic text-3xl text-gray-900">ፊ</span>
          <div>
            <p className="font-bold text-gray-900 text-lg">Fidel — Ge'ez Script Practice</p>
            <p className="text-sm text-gray-500">{SHEET_DESCRIPTIONS[sheetType].title} · {new Date().toLocaleDateString()}</p>
          </div>
        </div>
        <p className="text-xs text-gray-400">fidel.app</p>
      </div>

      {/* ── Sheet content ── */}
      <div className="bg-white rounded-2xl border border-[var(--color-border)] p-6 no-print-border-on-print">
        {sheetType === 'family' && selectedFamily && (
          <FamilySheet family={selectedFamily} />
        )}
        {sheetType === 'recognition' && (
          <RecognitionSheet chars={displayChars} />
        )}
        {sheetType === 'production' && (
          <ProductionSheet chars={displayChars} />
        )}
      </div>
    </div>
  )
}
