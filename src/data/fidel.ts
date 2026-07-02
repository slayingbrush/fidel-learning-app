import type { ConsonantFamily, FidelChar, Language, VowelOrder } from './types'

type RawFamily = {
  id: string
  name: string
  cr: string   // consonant romanization
  ci: string   // consonant IPA
  group: number
  langs: Language[]
  // chars in order 1-7: [char, romanization, ipa]
  orders: [string, string, string][]
}

const raw: RawFamily[] = [
  // ─── Group 1: Most common Amharic consonants ───────────────────────────────
  {
    id: 'ha', name: 'Ha', cr: 'h', ci: 'h', group: 1, langs: ['amharic', 'tigrinya'],
    orders: [
      ['ሀ', 'hä', 'hä'], ['ሁ', 'hu', 'hu'], ['ሂ', 'hi', 'hi'],
      ['ሃ', 'ha', 'ha'], ['ሄ', 'he', 'he'], ['ህ', 'hɨ', 'hɨ'], ['ሆ', 'ho', 'ho'],
    ],
  },
  {
    id: 'la', name: 'La', cr: 'l', ci: 'l', group: 1, langs: ['amharic', 'tigrinya'],
    orders: [
      ['ለ', 'lä', 'lä'], ['ሉ', 'lu', 'lu'], ['ሊ', 'li', 'li'],
      ['ላ', 'la', 'la'], ['ሌ', 'le', 'le'], ['ል', 'lɨ', 'lɨ'], ['ሎ', 'lo', 'lo'],
    ],
  },
  {
    id: 'ma', name: 'Ma', cr: 'm', ci: 'm', group: 1, langs: ['amharic', 'tigrinya'],
    orders: [
      ['መ', 'mä', 'mä'], ['ሙ', 'mu', 'mu'], ['ሚ', 'mi', 'mi'],
      ['ማ', 'ma', 'ma'], ['ሜ', 'me', 'me'], ['ም', 'mɨ', 'mɨ'], ['ሞ', 'mo', 'mo'],
    ],
  },
  {
    id: 'ra', name: 'Ra', cr: 'r', ci: 'r', group: 1, langs: ['amharic', 'tigrinya'],
    orders: [
      ['ረ', 'rä', 'rä'], ['ሩ', 'ru', 'ru'], ['ሪ', 'ri', 'ri'],
      ['ራ', 'ra', 'ra'], ['ሬ', 're', 're'], ['ር', 'rɨ', 'rɨ'], ['ሮ', 'ro', 'ro'],
    ],
  },
  {
    id: 'sa', name: 'Sa', cr: 's', ci: 's', group: 1, langs: ['amharic', 'tigrinya'],
    orders: [
      ['ሰ', 'sä', 'sä'], ['ሱ', 'su', 'su'], ['ሲ', 'si', 'si'],
      ['ሳ', 'sa', 'sa'], ['ሴ', 'se', 'se'], ['ስ', 'sɨ', 'sɨ'], ['ሶ', 'so', 'so'],
    ],
  },
  // ─── Group 2 ────────────────────────────────────────────────────────────────
  {
    id: 'sha', name: 'Sha', cr: 'sh', ci: 'ʃ', group: 2, langs: ['amharic', 'tigrinya'],
    orders: [
      ['ሸ', 'shä', 'ʃä'], ['ሹ', 'shu', 'ʃu'], ['ሺ', 'shi', 'ʃi'],
      ['ሻ', 'sha', 'ʃa'], ['ሼ', 'she', 'ʃe'], ['ሽ', 'shɨ', 'ʃɨ'], ['ሾ', 'sho', 'ʃo'],
    ],
  },
  {
    id: 'qa', name: 'Qa', cr: 'q', ci: 'qʼ', group: 2, langs: ['amharic', 'tigrinya'],
    orders: [
      ['ቀ', 'qä', 'qä'], ['ቁ', 'qu', 'qu'], ['ቂ', 'qi', 'qi'],
      ['ቃ', 'qa', 'qa'], ['ቄ', 'qe', 'qe'], ['ቅ', 'qɨ', 'qɨ'], ['ቆ', 'qo', 'qo'],
    ],
  },
  {
    id: 'ba', name: 'Ba', cr: 'b', ci: 'b', group: 2, langs: ['amharic', 'tigrinya'],
    orders: [
      ['በ', 'bä', 'bä'], ['ቡ', 'bu', 'bu'], ['ቢ', 'bi', 'bi'],
      ['ባ', 'ba', 'ba'], ['ቤ', 'be', 'be'], ['ብ', 'bɨ', 'bɨ'], ['ቦ', 'bo', 'bo'],
    ],
  },
  {
    id: 'ta', name: 'Ta', cr: 't', ci: 't', group: 2, langs: ['amharic', 'tigrinya'],
    orders: [
      ['ተ', 'tä', 'tä'], ['ቱ', 'tu', 'tu'], ['ቲ', 'ti', 'ti'],
      ['ታ', 'ta', 'ta'], ['ቴ', 'te', 'te'], ['ት', 'tɨ', 'tɨ'], ['ቶ', 'to', 'to'],
    ],
  },
  {
    id: 'cha', name: 'Cha', cr: 'ch', ci: 'tʃ', group: 2, langs: ['amharic', 'tigrinya'],
    orders: [
      ['ቸ', 'chä', 'tʃä'], ['ቹ', 'chu', 'tʃu'], ['ቺ', 'chi', 'tʃi'],
      ['ቻ', 'cha', 'tʃa'], ['ቼ', 'che', 'tʃe'], ['ች', 'chɨ', 'tʃɨ'], ['ቾ', 'cho', 'tʃo'],
    ],
  },
  // ─── Group 3 ────────────────────────────────────────────────────────────────
  {
    id: 'na', name: 'Na', cr: 'n', ci: 'n', group: 3, langs: ['amharic', 'tigrinya'],
    orders: [
      ['ነ', 'nä', 'nä'], ['ኑ', 'nu', 'nu'], ['ኒ', 'ni', 'ni'],
      ['ና', 'na', 'na'], ['ኔ', 'ne', 'ne'], ['ን', 'nɨ', 'nɨ'], ['ኖ', 'no', 'no'],
    ],
  },
  {
    id: 'nya', name: 'Nya', cr: 'ny', ci: 'ɲ', group: 3, langs: ['amharic', 'tigrinya'],
    orders: [
      ['ኘ', 'nyä', 'ɲä'], ['ኙ', 'nyu', 'ɲu'], ['ኚ', 'nyi', 'ɲi'],
      ['ኛ', 'nya', 'ɲa'], ['ኜ', 'nye', 'ɲe'], ['ኝ', 'nyɨ', 'ɲɨ'], ['ኞ', 'nyo', 'ɲo'],
    ],
  },
  {
    id: 'a', name: 'A (ʔ)', cr: 'ʔ', ci: 'ʔ', group: 3, langs: ['amharic', 'tigrinya'],
    orders: [
      ['አ', 'ä', 'ä'], ['ኡ', 'u', 'u'], ['ኢ', 'i', 'i'],
      ['ኣ', 'a', 'a'], ['ኤ', 'e', 'e'], ['እ', 'ɨ', 'ɨ'], ['ኦ', 'o', 'o'],
    ],
  },
  {
    id: 'ka', name: 'Ka', cr: 'k', ci: 'k', group: 3, langs: ['amharic', 'tigrinya'],
    orders: [
      ['ከ', 'kä', 'kä'], ['ኩ', 'ku', 'ku'], ['ኪ', 'ki', 'ki'],
      ['ካ', 'ka', 'ka'], ['ኬ', 'ke', 'ke'], ['ክ', 'kɨ', 'kɨ'], ['ኮ', 'ko', 'ko'],
    ],
  },
  {
    id: 'wa', name: 'Wa', cr: 'w', ci: 'w', group: 3, langs: ['amharic', 'tigrinya'],
    orders: [
      ['ወ', 'wä', 'wä'], ['ዉ', 'wu', 'wu'], ['ዊ', 'wi', 'wi'],
      ['ዋ', 'wa', 'wa'], ['ዌ', 'we', 'we'], ['ው', 'wɨ', 'wɨ'], ['ዎ', 'wo', 'wo'],
    ],
  },
  // ─── Group 4 ────────────────────────────────────────────────────────────────
  {
    id: 'za', name: 'Za', cr: 'z', ci: 'z', group: 4, langs: ['amharic', 'tigrinya'],
    orders: [
      ['ዘ', 'zä', 'zä'], ['ዙ', 'zu', 'zu'], ['ዚ', 'zi', 'zi'],
      ['ዛ', 'za', 'za'], ['ዜ', 'ze', 'ze'], ['ዝ', 'zɨ', 'zɨ'], ['ዞ', 'zo', 'zo'],
    ],
  },
  {
    id: 'ya', name: 'Ya', cr: 'y', ci: 'j', group: 4, langs: ['amharic', 'tigrinya'],
    orders: [
      ['የ', 'yä', 'jä'], ['ዩ', 'yu', 'ju'], ['ዪ', 'yi', 'ji'],
      ['ያ', 'ya', 'ja'], ['ዬ', 'ye', 'je'], ['ይ', 'yɨ', 'jɨ'], ['ዮ', 'yo', 'jo'],
    ],
  },
  {
    id: 'da', name: 'Da', cr: 'd', ci: 'd', group: 4, langs: ['amharic', 'tigrinya'],
    orders: [
      ['ደ', 'dä', 'dä'], ['ዱ', 'du', 'du'], ['ዲ', 'di', 'di'],
      ['ዳ', 'da', 'da'], ['ዴ', 'de', 'de'], ['ድ', 'dɨ', 'dɨ'], ['ዶ', 'do', 'do'],
    ],
  },
  {
    id: 'ja', name: 'Ja', cr: 'j', ci: 'dʒ', group: 4, langs: ['amharic', 'tigrinya'],
    orders: [
      ['ጀ', 'jä', 'dʒä'], ['ጁ', 'ju', 'dʒu'], ['ጂ', 'ji', 'dʒi'],
      ['ጃ', 'ja', 'dʒa'], ['ጄ', 'je', 'dʒe'], ['ጅ', 'jɨ', 'dʒɨ'], ['ጆ', 'jo', 'dʒo'],
    ],
  },
  {
    id: 'ga', name: 'Ga', cr: 'g', ci: 'g', group: 4, langs: ['amharic', 'tigrinya'],
    orders: [
      ['ገ', 'gä', 'gä'], ['ጉ', 'gu', 'gu'], ['ጊ', 'gi', 'gi'],
      ['ጋ', 'ga', 'ga'], ['ጌ', 'ge', 'ge'], ['ግ', 'gɨ', 'gɨ'], ['ጎ', 'go', 'go'],
    ],
  },
  // ─── Group 5: Ejectives (common in both Amharic & Tigrinya) ─────────────────
  {
    id: 'tta', name: 'Tta', cr: 'ṭ', ci: 'tʼ', group: 5, langs: ['amharic', 'tigrinya'],
    orders: [
      ['ጠ', 'ṭä', 'tʼä'], ['ጡ', 'ṭu', 'tʼu'], ['ጢ', 'ṭi', 'tʼi'],
      ['ጣ', 'ṭa', 'tʼa'], ['ጤ', 'ṭe', 'tʼe'], ['ጥ', 'ṭɨ', 'tʼɨ'], ['ጦ', 'ṭo', 'tʼo'],
    ],
  },
  {
    id: 'ccha', name: 'Ccha', cr: 'č̣', ci: 'tʃʼ', group: 5, langs: ['amharic', 'tigrinya'],
    orders: [
      ['ጨ', 'č̣ä', 'tʃʼä'], ['ጩ', 'č̣u', 'tʃʼu'], ['ጪ', 'č̣i', 'tʃʼi'],
      ['ጫ', 'č̣a', 'tʃʼa'], ['ጬ', 'č̣e', 'tʃʼe'], ['ጭ', 'č̣ɨ', 'tʃʼɨ'], ['ጮ', 'č̣o', 'tʃʼo'],
    ],
  },
  {
    id: 'tsa', name: 'Tsa', cr: 'ṣ', ci: 'tsʼ', group: 5, langs: ['amharic', 'tigrinya'],
    orders: [
      ['ጸ', 'ṣä', 'tsʼä'], ['ጹ', 'ṣu', 'tsʼu'], ['ጺ', 'ṣi', 'tsʼi'],
      ['ጻ', 'ṣa', 'tsʼa'], ['ጼ', 'ṣe', 'tsʼe'], ['ጽ', 'ṣɨ', 'tsʼɨ'], ['ጾ', 'ṣo', 'tsʼo'],
    ],
  },
  {
    id: 'fa', name: 'Fa', cr: 'f', ci: 'f', group: 5, langs: ['amharic', 'tigrinya'],
    orders: [
      ['ፈ', 'fä', 'fä'], ['ፉ', 'fu', 'fu'], ['ፊ', 'fi', 'fi'],
      ['ፋ', 'fa', 'fa'], ['ፌ', 'fe', 'fe'], ['ፍ', 'fɨ', 'fɨ'], ['ፎ', 'fo', 'fo'],
    ],
  },
  {
    id: 'pa', name: 'Pa', cr: 'p', ci: 'p', group: 5, langs: ['amharic', 'tigrinya'],
    orders: [
      ['ፐ', 'pä', 'pä'], ['ፑ', 'pu', 'pu'], ['ፒ', 'pi', 'pi'],
      ['ፓ', 'pa', 'pa'], ['ፔ', 'pe', 'pe'], ['ፕ', 'pɨ', 'pɨ'], ['ፖ', 'po', 'po'],
    ],
  },
  // ─── Group 6: Less-common / archaic (Amharic) ───────────────────────────────
  {
    id: 'hha', name: 'Hha', cr: 'ḥ', ci: 'ħ', group: 6, langs: ['amharic', 'tigrinya'],
    orders: [
      ['ሐ', 'ḥä', 'ħä'], ['ሑ', 'ḥu', 'ħu'], ['ሒ', 'ḥi', 'ħi'],
      ['ሓ', 'ḥa', 'ħa'], ['ሔ', 'ḥe', 'ħe'], ['ሕ', 'ḥɨ', 'ħɨ'], ['ሖ', 'ḥo', 'ħo'],
    ],
  },
  {
    id: 'ss', name: 'Ss', cr: 'ś', ci: 'ɕ', group: 6, langs: ['amharic'],
    orders: [
      ['ሠ', 'śä', 'ɕä'], ['ሡ', 'śu', 'ɕu'], ['ሢ', 'śi', 'ɕi'],
      ['ሣ', 'śa', 'ɕa'], ['ሤ', 'śe', 'ɕe'], ['ሥ', 'śɨ', 'ɕɨ'], ['ሦ', 'śo', 'ɕo'],
    ],
  },
  {
    id: 'hha2', name: 'H2a', cr: 'H', ci: 'ħ', group: 6, langs: ['amharic'],
    orders: [
      ['ኀ', 'Hä', 'ħä'], ['ኁ', 'Hu', 'ħu'], ['ኂ', 'Hi', 'ħi'],
      ['ኃ', 'Ha', 'ħa'], ['ኄ', 'He', 'ħe'], ['ኅ', 'Hɨ', 'ħɨ'], ['ኆ', 'Ho', 'ħo'],
    ],
  },
  {
    id: 'aa', name: 'Aa (ʕ)', cr: 'ʕ', ci: 'ʕ', group: 6, langs: ['amharic'],
    orders: [
      ['ዐ', 'ʕä', 'ʕä'], ['ዑ', 'ʕu', 'ʕu'], ['ዒ', 'ʕi', 'ʕi'],
      ['ዓ', 'ʕa', 'ʕa'], ['ዔ', 'ʕe', 'ʕe'], ['ዕ', 'ʕɨ', 'ʕɨ'], ['ዖ', 'ʕo', 'ʕo'],
    ],
  },
  {
    id: 'zha', name: 'Zha', cr: 'zh', ci: 'ʒ', group: 6, langs: ['amharic'],
    orders: [
      ['ዠ', 'zhä', 'ʒä'], ['ዡ', 'zhu', 'ʒu'], ['ዢ', 'zhi', 'ʒi'],
      ['ዣ', 'zha', 'ʒa'], ['ዤ', 'zhe', 'ʒe'], ['ዥ', 'zhɨ', 'ʒɨ'], ['ዦ', 'zho', 'ʒo'],
    ],
  },
  {
    id: 'ppa', name: 'Ppa', cr: 'p̣', ci: 'pʼ', group: 6, langs: ['amharic', 'tigrinya'],
    orders: [
      ['ጰ', 'p̣ä', 'pʼä'], ['ጱ', 'p̣u', 'pʼu'], ['ጲ', 'p̣i', 'pʼi'],
      ['ጳ', 'p̣a', 'pʼa'], ['ጴ', 'p̣e', 'pʼe'], ['ጵ', 'p̣ɨ', 'pʼɨ'], ['ጶ', 'p̣o', 'pʼo'],
    ],
  },
  {
    id: 'tts', name: 'Tts', cr: 'ṧ', ci: 'sʼ', group: 6, langs: ['amharic', 'tigrinya'],
    orders: [
      ['ፀ', 'ṧä', 'sʼä'], ['ፁ', 'ṧu', 'sʼu'], ['ፂ', 'ṧi', 'sʼi'],
      ['ፃ', 'ṧa', 'sʼa'], ['ፄ', 'ṧe', 'sʼe'], ['ፅ', 'ṧɨ', 'sʼɨ'], ['ፆ', 'ṧo', 'sʼo'],
    ],
  },
  {
    id: 'va', name: 'Va', cr: 'v', ci: 'v', group: 6, langs: ['amharic', 'tigrinya'],
    orders: [
      ['ቨ', 'vä', 'vä'], ['ቩ', 'vu', 'vu'], ['ቪ', 'vi', 'vi'],
      ['ቫ', 'va', 'va'], ['ቬ', 've', 've'], ['ቭ', 'vɨ', 'vɨ'], ['ቮ', 'vo', 'vo'],
    ],
  },
  // ─── Group 7: Tigrinya-specific ─────────────────────────────────────────────
  {
    id: 'dda', name: 'Dda', cr: 'ḍ', ci: 'dʼ', group: 7, langs: ['tigrinya'],
    orders: [
      ['ዸ', 'ḍä', 'dʼä'], ['ዹ', 'ḍu', 'dʼu'], ['ዺ', 'ḍi', 'dʼi'],
      ['ዻ', 'ḍa', 'dʼa'], ['ዼ', 'ḍe', 'dʼe'], ['ዽ', 'ḍɨ', 'dʼɨ'], ['ዾ', 'ḍo', 'dʼo'],
    ],
  },
]

function buildFamily(r: RawFamily): ConsonantFamily {
  const chars: FidelChar[] = r.orders.map(([char, rom, ipa], idx) => ({
    id: `${r.id}-${idx + 1}`,
    char,
    familyId: r.id,
    order: (idx + 1) as VowelOrder,
    romanization: rom,
    ipa,
    languages: r.langs,
  }))
  return {
    id: r.id,
    name: r.name,
    consonantRomanization: r.cr,
    consonantIpa: r.ci,
    chars,
    languages: r.langs,
    group: r.group,
  }
}

export const CONSONANT_FAMILIES: ConsonantFamily[] = raw.map(buildFamily)

export const ALL_CHARS: FidelChar[] = CONSONANT_FAMILIES.flatMap(f => f.chars)

export const CHAR_MAP: Record<string, FidelChar> = Object.fromEntries(
  ALL_CHARS.map(c => [c.id, c])
)

export const FAMILY_MAP: Record<string, ConsonantFamily> = Object.fromEntries(
  CONSONANT_FAMILIES.map(f => [f.id, f])
)

export function getFamiliesForLanguage(lang: Language): ConsonantFamily[] {
  return CONSONANT_FAMILIES.filter(f => f.languages.includes(lang))
}

export function getCharsForLanguage(lang: Language): FidelChar[] {
  return ALL_CHARS.filter(c => c.languages.includes(lang))
}

export function getFamiliesByGroup(lang: Language): Map<number, ConsonantFamily[]> {
  const map = new Map<number, ConsonantFamily[]>()
  getFamiliesForLanguage(lang).forEach(f => {
    const arr = map.get(f.group) ?? []
    arr.push(f)
    map.set(f.group, arr)
  })
  return map
}
