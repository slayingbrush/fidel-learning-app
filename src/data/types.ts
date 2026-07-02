export type Language = 'amharic' | 'tigrinya'
export type VowelOrder = 1 | 2 | 3 | 4 | 5 | 6 | 7
export type MasteryLevel = 'new' | 'learning' | 'mastered'

export interface FidelChar {
  id: string            // e.g. "ha-1"
  char: string          // Unicode: "ሀ"
  familyId: string      // e.g. "ha"
  order: VowelOrder
  romanization: string  // e.g. "hä"
  ipa: string           // e.g. "/hä/"
  languages: Language[]
}

export interface ConsonantFamily {
  id: string            // e.g. "ha"
  name: string          // display name: "Ha"
  consonantRomanization: string  // "h"
  consonantIpa: string  // "/h/"
  chars: FidelChar[]    // 7 orders
  languages: Language[]
  group: number         // introduction order group (1 = first taught)
}

export interface FidelWord {
  id: string
  fidel: string         // "ሰላም"
  charIds: string[]     // ["sa-1", "la-4", "ma-6"]
  romanization: string  // "selam"
  meaning: string       // "hello / peace"
  language: Language
  tier: 1 | 2 | 3      // 1=2chars, 2=3chars, 3=4+chars
}

export const VOWEL_ORDER_INFO: Record<VowelOrder, { name: string; vowel: string; ipa: string }> = {
  1: { name: '1st order', vowel: 'ä', ipa: '/ä/' },
  2: { name: '2nd order', vowel: 'u', ipa: '/u/' },
  3: { name: '3rd order', vowel: 'i', ipa: '/i/' },
  4: { name: '4th order', vowel: 'a', ipa: '/a/' },
  5: { name: '5th order', vowel: 'e', ipa: '/e/' },
  6: { name: '6th order', vowel: 'ɨ', ipa: '/ɨ/' },
  7: { name: '7th order', vowel: 'o', ipa: '/o/' },
}
