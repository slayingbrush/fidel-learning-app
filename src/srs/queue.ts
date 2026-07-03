import { isDue, masteryLevel, type CardData } from './sm2'
import type { FidelChar } from '../data/types'

export type ReviewMode = 'char-to-sound' | 'sound-to-char' | 'type-sound'

export interface ReviewItem {
  char: FidelChar
  mode: ReviewMode
  cardData: CardData
}

function pickMode(card: CardData): ReviewMode {
  const reps = card.repetitions
  const level = masteryLevel(card)

  // Brand new: recognition only — easier, builds familiarity first
  if (reps < 2) return 'char-to-sound'

  // Mastered: weight heavily toward free-recall typing (desirable difficulty)
  if (level === 'mastered') {
    const r = Math.random()
    if (r < 0.55) return 'type-sound'
    if (r < 0.80) return 'char-to-sound'
    return 'sound-to-char'
  }

  // Learning (reps 2-4): introduce typing gradually
  if (reps >= 4) {
    const r = Math.random()
    if (r < 0.35) return 'type-sound'
    if (r < 0.65) return 'char-to-sound'
    return 'sound-to-char'
  }

  // Early learning (reps 2-3): alternate recognition directions
  return reps % 2 === 0 ? 'char-to-sound' : 'sound-to-char'
}

/**
 * Build today's review queue from a set of cards.
 * Returns due cards sorted by: overdue first, then least recently reviewed.
 */
export function buildReviewQueue(
  chars: FidelChar[],
  cardStates: Record<string, CardData>,
  now = Date.now()
): ReviewItem[] {
  const due: ReviewItem[] = []

  for (const char of chars) {
    const card = cardStates[char.id]
    if (!card) continue
    if (!isDue(card, now)) continue
    due.push({ char, mode: pickMode(card), cardData: card })
  }

  // Sort: most overdue first, then by fewest repetitions
  due.sort((a, b) => {
    const overdueDiff = a.cardData.nextReview - b.cardData.nextReview
    if (overdueDiff !== 0) return overdueDiff
    return a.cardData.repetitions - b.cardData.repetitions
  })

  return due
}

/**
 * Pick 4 distractor characters for multiple-choice.
 */
export function buildChoices(
  correct: FidelChar,
  allChars: FidelChar[],
  count = 4
): FidelChar[] {
  const sameOrder = allChars.filter(
    c => c.id !== correct.id && c.order === correct.order
  )
  const sameFamily = allChars.filter(
    c => c.id !== correct.id && c.familyId === correct.familyId
  )

  const distractors: FidelChar[] = []
  const seen = new Set<string>([correct.id])

  shuffle(sameFamily).slice(0, 2).forEach(c => {
    if (!seen.has(c.id)) { distractors.push(c); seen.add(c.id) }
  })
  shuffle(sameOrder).forEach(c => {
    if (distractors.length >= count - 1) return
    if (!seen.has(c.id)) { distractors.push(c); seen.add(c.id) }
  })
  shuffle(allChars).forEach(c => {
    if (distractors.length >= count - 1) return
    if (!seen.has(c.id)) { distractors.push(c); seen.add(c.id) }
  })

  return shuffle([correct, ...distractors.slice(0, count - 1)])
}

/**
 * Normalize a romanization string to allow typing without special characters.
 * ä → a, ɨ → e (approximate but allows keyboard-friendly input).
 */
export function normalizeRomanization(s: string): string {
  return s.trim().toLowerCase()
    .replace(/ä/g, 'a')
    .replace(/ɨ/g, 'e')
}

export function checkTypedAnswer(input: string, romanization: string): boolean {
  const typed = input.trim().toLowerCase()
  return typed === romanization.toLowerCase() || typed === normalizeRomanization(romanization)
}

export function getQueueStats(
  chars: FidelChar[],
  cardStates: Record<string, CardData>
): { total: number; new: number; learning: number; mastered: number; dueToday: number } {
  let newCount = 0, learningCount = 0, masteredCount = 0, due = 0
  const now = Date.now()
  for (const char of chars) {
    const card = cardStates[char.id]
    if (!card) { newCount++; due++; continue }
    const level = masteryLevel(card)
    if (level === 'new') newCount++
    else if (level === 'learning') learningCount++
    else masteredCount++
    if (isDue(card, now)) due++
  }
  return { total: chars.length, new: newCount, learning: learningCount, mastered: masteredCount, dueToday: due }
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
