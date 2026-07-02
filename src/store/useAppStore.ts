import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'
import { DEFAULT_CARD, reviewCard, type CardData } from '../srs/sm2'
import {
  loadProfile, saveProfile, loadCardStates, saveCardState,
  loadUnlockedFamilies, unlockFamily as dbUnlockFamily,
  loadDecodedWords, markWordDecoded as dbMarkWordDecoded,
  type UserProfile,
} from '../storage/db'
import { getFamiliesForLanguage, getCharsForLanguage, FAMILY_MAP } from '../data/fidel'
import type { Language } from '../data/types'

interface AppState {
  // Hydration
  hydrated: boolean

  // User
  profile: UserProfile | null
  cardStates: Record<string, CardData>
  unlockedFamilies: Set<string>
  decodedWords: Set<string>

  // Actions
  hydrate: () => Promise<void>
  createProfile: (language: Language, name?: string) => Promise<void>
  reviewCard: (characterId: string, quality: 0 | 1 | 2 | 3 | 4 | 5) => Promise<void>
  unlockFamily: (familyId: string) => Promise<void>
  markWordDecoded: (wordId: string) => Promise<void>

  // Derived helpers (computed inline)
  getCardState: (characterId: string) => CardData
  isUnlocked: (familyId: string) => boolean
  nextGroupToUnlock: () => number | null
}

export const useAppStore = create<AppState>((set, get) => ({
  hydrated: false,
  profile: null,
  cardStates: {},
  unlockedFamilies: new Set(),
  decodedWords: new Set(),

  hydrate: async () => {
    try {
      const [profile, cardStates, unlockedFamilies, decodedWords] = await Promise.all([
        loadProfile(),
        loadCardStates(),
        loadUnlockedFamilies(),
        loadDecodedWords(),
      ])
      set({ profile, cardStates, unlockedFamilies, decodedWords, hydrated: true })
    } catch {
      // IndexedDB unavailable (private mode, quota, corruption) — show onboarding
      set({ hydrated: true })
    }
  },

  createProfile: async (language, name = '') => {
    const profile: UserProfile = {
      id: 'profile',
      language,
      name,
      createdAt: Date.now(),
      lastSession: Date.now(),
      streakDays: 1,
      lastStreakDate: new Date().toISOString().slice(0, 10),
    }
    await saveProfile(profile)

    // Unlock group 1 families for the chosen language and initialize their cards
    const families = getFamiliesForLanguage(language).filter(f => f.group === 1)
    const newCardStates: Record<string, CardData> = {}
    const unlocked = new Set<string>()

    for (const family of families) {
      await dbUnlockFamily(family.id)
      unlocked.add(family.id)
      for (const char of family.chars) {
        const card = { ...DEFAULT_CARD, nextReview: Date.now() }
        newCardStates[char.id] = card
        await saveCardState(char.id, card)
      }
    }

    set({ profile, cardStates: newCardStates, unlockedFamilies: unlocked })
  },

  reviewCard: async (characterId, quality) => {
    const { cardStates } = get()
    const current = cardStates[characterId] ?? DEFAULT_CARD
    const updated = reviewCard(current, quality)
    await saveCardState(characterId, updated)
    set(s => ({ cardStates: { ...s.cardStates, [characterId]: updated } }))
  },

  unlockFamily: async (familyId) => {
    const { profile, unlockedFamilies, cardStates } = get()
    if (!profile || unlockedFamilies.has(familyId)) return

    const family = FAMILY_MAP[familyId]
    if (!family) return

    await dbUnlockFamily(familyId)
    const newStates = { ...cardStates }
    for (const char of family.chars) {
      if (!newStates[char.id]) {
        const card = { ...DEFAULT_CARD, nextReview: Date.now() }
        newStates[char.id] = card
        await saveCardState(char.id, card)
      }
    }

    set(s => ({
      unlockedFamilies: new Set([...s.unlockedFamilies, familyId]),
      cardStates: newStates,
    }))
  },

  markWordDecoded: async (wordId) => {
    await dbMarkWordDecoded(wordId)
    set(s => ({ decodedWords: new Set([...s.decodedWords, wordId]) }))
  },

  getCardState: (characterId) => {
    return get().cardStates[characterId] ?? DEFAULT_CARD
  },

  isUnlocked: (familyId) => {
    return get().unlockedFamilies.has(familyId)
  },

  nextGroupToUnlock: () => {
    const { profile, unlockedFamilies } = get()
    if (!profile) return null
    const families = getFamiliesForLanguage(profile.language)
    const groups = [...new Set(families.map(f => f.group))].sort((a, b) => a - b)
    for (const g of groups) {
      const inGroup = families.filter(f => f.group === g)
      const allUnlocked = inGroup.every(f => unlockedFamilies.has(f.id))
      if (!allUnlocked) return g
    }
    return null
  },
}))

export function useLanguage(): Language {
  return useAppStore(s => s.profile?.language ?? 'amharic')
}

export function useUnlockedChars() {
  const { profile, unlockedFamilies } = useAppStore(
    useShallow(s => ({ profile: s.profile, unlockedFamilies: s.unlockedFamilies }))
  )
  if (!profile) return []
  return getCharsForLanguage(profile.language).filter(c =>
    unlockedFamilies.has(c.familyId)
  )
}
