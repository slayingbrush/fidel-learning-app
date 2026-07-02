/**
 * SM-2 Spaced Repetition Algorithm
 *
 * Quality scores (0-5):
 *   5 — perfect response
 *   4 — correct with slight hesitation
 *   3 — correct after significant effort
 *   2 — incorrect but on seeing the answer felt easy
 *   1 — incorrect, correct answer seemed easy on recall
 *   0 — complete blackout
 *
 * A quality < 3 triggers immediate re-scheduling (interval reset to 1 day).
 */

export interface CardData {
  ef: number          // easiness factor, min 1.3, starts at 2.5
  interval: number    // days until next review
  repetitions: number // consecutive correct reviews
  nextReview: number  // unix timestamp ms
  lastReview: number  // unix timestamp ms
}

export const DEFAULT_CARD: CardData = {
  ef: 2.5,
  interval: 0,
  repetitions: 0,
  nextReview: 0,
  lastReview: 0,
}

export function reviewCard(card: CardData, quality: 0 | 1 | 2 | 3 | 4 | 5, now = Date.now()): CardData {
  if (quality < 0 || quality > 5) throw new RangeError('quality must be 0–5')

  const newEf = clampEf(card.ef + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))

  let newInterval: number
  let newReps: number

  if (quality < 3) {
    newInterval = 1
    newReps = 0
  } else {
    newReps = card.repetitions + 1
    if (card.repetitions === 0) {
      newInterval = 1
    } else if (card.repetitions === 1) {
      newInterval = 6
    } else {
      newInterval = Math.round(card.interval * card.ef)
    }
  }

  return {
    ef: newEf,
    interval: newInterval,
    repetitions: newReps,
    nextReview: now + newInterval * MS_PER_DAY,
    lastReview: now,
  }
}

export function isDue(card: CardData, now = Date.now()): boolean {
  return now >= card.nextReview
}

export function masteryLevel(card: CardData): 'new' | 'learning' | 'mastered' {
  if (card.repetitions === 0) return 'new'
  if (card.repetitions < 3 || card.interval < 21) return 'learning'
  return 'mastered'
}

export function daysUntilReview(card: CardData, now = Date.now()): number {
  return Math.max(0, Math.ceil((card.nextReview - now) / MS_PER_DAY))
}

function clampEf(ef: number): number {
  return Math.max(1.3, Math.round(ef * 1000) / 1000)
}

const MS_PER_DAY = 24 * 60 * 60 * 1000
