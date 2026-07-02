import { isDue, masteryLevel, type CardData } from './sm2'
import type { FidelChar } from '../data/types'

export type ReviewMode = 'char-to-sound' | 'sound-to-char'

export interface ReviewItem {
  char: FidelChar
  mode: ReviewMode
  cardData: CardData
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
    // Alternate modes to build both recognition directions
    const mode: ReviewMode = card.repetitions % 2 === 0 ? 'char-to-sound' : 'sound-to-char'
    due.push({ char, mode, cardData: card })
  }

  // Sort: most overdue first (smallest nextReview), then by least repetitions
  due.sort((a, b) => {
    const overdueDiff = a.cardData.nextReview - b.cardData.nextReview
    if (overdueDiff !== 0) return overdueDiff
    return a.cardData.repetitions - b.cardData.repetitions
  })

  return due
}

/**
 * Pick 4 distractor characters for multiple-choice. Returns the correct char
 * plus 3 wrong chars from the same group or adjacent families.
 */
export function buildChoices(
  correct: FidelChar,
  allChars: FidelChar[],
  count = 4
): FidelChar[] {
  // Same order from different families = harder (shapes look different, sounds are similar vowel)
  const sameOrder = allChars.filter(
    c => c.id !== correct.id && c.order === correct.order
  )
  // Same family different order = teaches vowel pattern
  const sameFamily = allChars.filter(
    c => c.id !== correct.id && c.familyId === correct.familyId
  )

  const distractors: FidelChar[] = []
  const seen = new Set<string>([correct.id])

  // Prefer same-family distractors (vowel pattern learning)
  shuffle(sameFamily).slice(0, 2).forEach(c => {
    if (!seen.has(c.id)) { distractors.push(c); seen.add(c.id) }
  })
  // Fill remaining from same order (cross-family)
  shuffle(sameOrder).forEach(c => {
    if (distractors.length >= count - 1) return
    if (!seen.has(c.id)) { distractors.push(c); seen.add(c.id) }
  })
  // Fallback: any remaining chars
  shuffle(allChars).forEach(c => {
    if (distractors.length >= count - 1) return
    if (!seen.has(c.id)) { distractors.push(c); seen.add(c.id) }
  })

  const choices = [correct, ...distractors.slice(0, count - 1)]
  return shuffle(choices)
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
