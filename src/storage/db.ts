import { openDB, type IDBPDatabase } from 'idb'
import type { CardData } from '../srs/sm2'
import type { Language } from '../data/types'

const DB_NAME = 'fidel-app'
const DB_VERSION = 1

export interface UserProfile {
  id: 'profile'
  language: Language
  name: string
  createdAt: number
  lastSession: number
  streakDays: number
  lastStreakDate: string  // YYYY-MM-DD
}

export interface SessionStats {
  id: string             // YYYY-MM-DD
  cardsReviewed: number
  correctFirst: number
  wordsDecoded: number
  minutesStudied: number
}

interface FidelDB {
  profile: { key: 'profile'; value: UserProfile }
  cardStates: { key: string; value: CardData & { id: string } }
  unlockedFamilies: { key: string; value: { id: string; unlockedAt: number } }
  decodedWords: { key: string; value: { id: string; decodedAt: number; count: number } }
  sessions: { key: string; value: SessionStats }
}

let _db: IDBPDatabase<FidelDB> | null = null

async function getDb(): Promise<IDBPDatabase<FidelDB>> {
  if (_db) return _db
  _db = await openDB<FidelDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      db.createObjectStore('profile', { keyPath: 'id' })
      db.createObjectStore('cardStates', { keyPath: 'id' })
      db.createObjectStore('unlockedFamilies', { keyPath: 'id' })
      db.createObjectStore('decodedWords', { keyPath: 'id' })
      db.createObjectStore('sessions', { keyPath: 'id' })
    },
  })
  return _db
}

// ─── Profile ─────────────────────────────────────────────────────
export async function loadProfile(): Promise<UserProfile | null> {
  const db = await getDb()
  return (await db.get('profile', 'profile')) ?? null
}

export async function saveProfile(profile: UserProfile): Promise<void> {
  const db = await getDb()
  await db.put('profile', profile)
}

// ─── Card states ─────────────────────────────────────────────────
export async function loadCardStates(): Promise<Record<string, CardData>> {
  const db = await getDb()
  const all = await db.getAll('cardStates')
  return Object.fromEntries(all.map(({ id, ...card }) => [id, card as CardData]))
}

export async function saveCardState(characterId: string, card: CardData): Promise<void> {
  const db = await getDb()
  await db.put('cardStates', { id: characterId, ...card })
}

export async function saveCardStates(states: Record<string, CardData>): Promise<void> {
  const db = await getDb()
  const tx = db.transaction('cardStates', 'readwrite')
  await Promise.all([
    ...Object.entries(states).map(([id, card]) => tx.store.put({ id, ...card })),
    tx.done,
  ])
}

// ─── Unlocked families ───────────────────────────────────────────
export async function loadUnlockedFamilies(): Promise<Set<string>> {
  const db = await getDb()
  const all = await db.getAll('unlockedFamilies')
  return new Set(all.map(r => r.id))
}

export async function unlockFamily(familyId: string): Promise<void> {
  const db = await getDb()
  await db.put('unlockedFamilies', { id: familyId, unlockedAt: Date.now() })
}

// ─── Decoded words ───────────────────────────────────────────────
export async function loadDecodedWords(): Promise<Set<string>> {
  const db = await getDb()
  const all = await db.getAll('decodedWords')
  return new Set(all.map(r => r.id))
}

export async function markWordDecoded(wordId: string): Promise<void> {
  const db = await getDb()
  const existing = await db.get('decodedWords', wordId)
  await db.put('decodedWords', {
    id: wordId,
    decodedAt: Date.now(),
    count: (existing?.count ?? 0) + 1,
  })
}

// ─── Sessions ────────────────────────────────────────────────────
export async function saveSession(stats: SessionStats): Promise<void> {
  const db = await getDb()
  const existing = await db.get('sessions', stats.id)
  await db.put('sessions', {
    id: stats.id,
    cardsReviewed: (existing?.cardsReviewed ?? 0) + stats.cardsReviewed,
    correctFirst: (existing?.correctFirst ?? 0) + stats.correctFirst,
    wordsDecoded: (existing?.wordsDecoded ?? 0) + stats.wordsDecoded,
    minutesStudied: (existing?.minutesStudied ?? 0) + stats.minutesStudied,
  })
}

export async function loadRecentSessions(days = 7): Promise<SessionStats[]> {
  const db = await getDb()
  const all = await db.getAll('sessions')
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - days)
  return all.filter(s => s.id >= cutoff.toISOString().slice(0, 10)).sort((a, b) => b.id.localeCompare(a.id))
}

export function todayKey(): string {
  return new Date().toISOString().slice(0, 10)
}
