import { describe, it, expect } from 'vitest'
import { reviewCard, isDue, masteryLevel, daysUntilReview, DEFAULT_CARD, type CardData } from './sm2'

const NOW = 1_700_000_000_000
const DAY = 24 * 60 * 60 * 1000

describe('reviewCard', () => {
  it('first perfect review sets interval to 1 day', () => {
    const result = reviewCard(DEFAULT_CARD, 5, NOW)
    expect(result.interval).toBe(1)
    expect(result.repetitions).toBe(1)
  })

  it('second perfect review sets interval to 6 days', () => {
    const after1 = reviewCard(DEFAULT_CARD, 5, NOW)
    const result = reviewCard(after1, 5, NOW)
    expect(result.interval).toBe(6)
    expect(result.repetitions).toBe(2)
  })

  it('third perfect review multiplies by EF (~2.5)', () => {
    const after1 = reviewCard(DEFAULT_CARD, 5, NOW)
    const after2 = reviewCard(after1, 5, NOW)
    const result = reviewCard(after2, 5, NOW)
    expect(result.interval).toBe(Math.round(6 * after2.ef))
    expect(result.repetitions).toBe(3)
  })

  it('quality < 3 resets repetitions and interval to 1', () => {
    let card = reviewCard(DEFAULT_CARD, 5, NOW)
    card = reviewCard(card, 5, NOW)
    card = reviewCard(card, 2, NOW) // fail
    expect(card.repetitions).toBe(0)
    expect(card.interval).toBe(1)
  })

  it('EF increases on quality 5', () => {
    const result = reviewCard(DEFAULT_CARD, 5, NOW)
    expect(result.ef).toBeGreaterThan(DEFAULT_CARD.ef)
  })

  it('EF decreases on quality 3', () => {
    const result = reviewCard(DEFAULT_CARD, 3, NOW)
    expect(result.ef).toBeLessThan(DEFAULT_CARD.ef)
  })

  it('EF never drops below 1.3', () => {
    let card: CardData = { ...DEFAULT_CARD, ef: 1.3 }
    card = reviewCard(card, 0, NOW)
    expect(card.ef).toBeGreaterThanOrEqual(1.3)
  })

  it('nextReview is set to now + interval days', () => {
    const result = reviewCard(DEFAULT_CARD, 5, NOW)
    expect(result.nextReview).toBe(NOW + result.interval * DAY)
  })

  it('lastReview is set to now', () => {
    const result = reviewCard(DEFAULT_CARD, 5, NOW)
    expect(result.lastReview).toBe(NOW)
  })

  it('throws on invalid quality', () => {
    expect(() => reviewCard(DEFAULT_CARD, 6 as never, NOW)).toThrow()
    expect(() => reviewCard(DEFAULT_CARD, -1 as never, NOW)).toThrow()
  })

  it('quality 0 produces lowest EF change', () => {
    const q0 = reviewCard(DEFAULT_CARD, 0, NOW)
    const q5 = reviewCard(DEFAULT_CARD, 5, NOW)
    expect(q0.ef).toBeLessThan(q5.ef)
  })
})

describe('isDue', () => {
  it('new card is immediately due', () => {
    expect(isDue(DEFAULT_CARD, NOW)).toBe(true)
  })

  it('card with future nextReview is not due', () => {
    const card = reviewCard(DEFAULT_CARD, 5, NOW)
    expect(isDue(card, NOW)).toBe(false)
  })

  it('card becomes due after interval elapses', () => {
    const card = reviewCard(DEFAULT_CARD, 5, NOW)
    expect(isDue(card, NOW + card.interval * DAY)).toBe(true)
  })
})

describe('masteryLevel', () => {
  it('new card is "new"', () => {
    expect(masteryLevel(DEFAULT_CARD)).toBe('new')
  })

  it('card with repetitions 1-2 is "learning"', () => {
    const after1 = reviewCard(DEFAULT_CARD, 5, NOW)
    expect(masteryLevel(after1)).toBe('learning')
  })

  it('card with repetitions >= 3 and interval >= 21 is "mastered"', () => {
    const card: CardData = { ef: 2.5, interval: 21, repetitions: 3, nextReview: NOW + 21 * DAY, lastReview: NOW }
    expect(masteryLevel(card)).toBe('mastered')
  })

  it('card with high repetitions but short interval is still "learning"', () => {
    const card: CardData = { ef: 2.5, interval: 10, repetitions: 5, nextReview: NOW + 10 * DAY, lastReview: NOW }
    expect(masteryLevel(card)).toBe('learning')
  })
})

describe('daysUntilReview', () => {
  it('returns 0 for due card', () => {
    expect(daysUntilReview(DEFAULT_CARD, NOW)).toBe(0)
  })

  it('returns correct days for future card', () => {
    const card = reviewCard(DEFAULT_CARD, 5, NOW)
    expect(daysUntilReview(card, NOW)).toBe(card.interval)
  })
})
