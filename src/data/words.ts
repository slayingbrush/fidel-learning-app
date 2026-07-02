import type { FidelWord } from './types'

export const WORDS: FidelWord[] = [
  // ═══════════════════════════════════════════════════════════════
  // AMHARIC — Tier 1 (2 characters)
  // ═══════════════════════════════════════════════════════════════
  { id: 'am-t1-01', fidel: 'ቤት',  charIds: ['ba-5','ta-6'],        romanization: 'bet',    meaning: 'house',          language: 'amharic', tier: 1 },
  { id: 'am-t1-02', fidel: 'ውሃ',  charIds: ['wa-6','ha-4'],        romanization: 'wɨha',   meaning: 'water',          language: 'amharic', tier: 1 },
  { id: 'am-t1-03', fidel: 'ቀን',  charIds: ['qa-1','na-6'],        romanization: 'qen',    meaning: 'day',            language: 'amharic', tier: 1 },
  { id: 'am-t1-04', fidel: 'ልጅ',  charIds: ['la-6','ja-6'],        romanization: 'lɨj',    meaning: 'child',          language: 'amharic', tier: 1 },
  { id: 'am-t1-05', fidel: 'አዎ',  charIds: ['a-1','wa-7'],         romanization: 'awo',    meaning: 'yes',            language: 'amharic', tier: 1 },
  { id: 'am-t1-06', fidel: 'ዛፍ',  charIds: ['za-4','fa-6'],        romanization: 'zaf',    meaning: 'tree',           language: 'amharic', tier: 1 },
  { id: 'am-t1-07', fidel: 'ወር',  charIds: ['wa-1','ra-6'],        romanization: 'wer',    meaning: 'month',          language: 'amharic', tier: 1 },
  { id: 'am-t1-08', fidel: 'ሴት',  charIds: ['sa-5','ta-6'],        romanization: 'set',    meaning: 'woman',          language: 'amharic', tier: 1 },
  { id: 'am-t1-09', fidel: 'ጊዜ',  charIds: ['ga-3','za-5'],        romanization: 'gize',   meaning: 'time',           language: 'amharic', tier: 1 },
  { id: 'am-t1-10', fidel: 'ምን',  charIds: ['ma-6','na-6'],        romanization: 'mɨn',    meaning: 'what',           language: 'amharic', tier: 1 },
  { id: 'am-t1-11', fidel: 'ነጭ',  charIds: ['na-1','ccha-6'],      romanization: 'neč̣',   meaning: 'white',          language: 'amharic', tier: 1 },
  { id: 'am-t1-12', fidel: 'ጥቁር', charIds: ['tta-6','qa-6','ra-4'], romanization: 'ṭɨqur',  meaning: 'black',          language: 'amharic', tier: 1 },

  // ═══════════════════════════════════════════════════════════════
  // AMHARIC — Tier 2 (3 characters)
  // ═══════════════════════════════════════════════════════════════
  { id: 'am-t2-01', fidel: 'ሰላም', charIds: ['sa-1','la-4','ma-6'],        romanization: 'selam',   meaning: 'hello / peace',  language: 'amharic', tier: 2 },
  { id: 'am-t2-02', fidel: 'ዳቦ',  charIds: ['da-4','ba-7'],               romanization: 'dabo',    meaning: 'bread',          language: 'amharic', tier: 2 },
  { id: 'am-t2-03', fidel: 'ዛሬ',  charIds: ['za-4','ra-5'],               romanization: 'zare',    meaning: 'today',          language: 'amharic', tier: 2 },
  { id: 'am-t2-04', fidel: 'ነገ',  charIds: ['na-1','ga-1'],               romanization: 'nege',    meaning: 'tomorrow',       language: 'amharic', tier: 2 },
  { id: 'am-t2-05', fidel: 'ወንዝ', charIds: ['wa-1','na-6','za-6'],        romanization: 'wenz',    meaning: 'river',          language: 'amharic', tier: 2 },
  { id: 'am-t2-06', fidel: 'መኪና', charIds: ['ma-1','ka-3','na-4'],        romanization: 'mekina',  meaning: 'car',            language: 'amharic', tier: 2 },
  { id: 'am-t2-07', fidel: 'ስልክ', charIds: ['sa-6','la-6','ka-6'],        romanization: 'sɨlɨk',   meaning: 'phone',          language: 'amharic', tier: 2 },
  { id: 'am-t2-08', fidel: 'ወተት', charIds: ['wa-1','ta-1','ta-6'],        romanization: 'wetet',   meaning: 'milk',           language: 'amharic', tier: 2 },
  { id: 'am-t2-09', fidel: 'ምግብ', charIds: ['ma-6','ga-6','ba-6'],        romanization: 'mɨgɨb',   meaning: 'food',           language: 'amharic', tier: 2 },
  { id: 'am-t2-10', fidel: 'ሀገር', charIds: ['ha-1','ga-1','ra-6'],        romanization: 'hager',   meaning: 'country',        language: 'amharic', tier: 2 },
  { id: 'am-t2-11', fidel: 'ጸሐይ', charIds: ['tsa-1','hha-1','ya-6'],      romanization: 'ṣɨhay',   meaning: 'sun',            language: 'amharic', tier: 2 },
  { id: 'am-t2-12', fidel: 'ዓይን', charIds: ['aa-4','ya-6','na-6'],        romanization: 'ayn',     meaning: 'eye',            language: 'amharic', tier: 2 },
  { id: 'am-t2-13', fidel: 'ደም',  charIds: ['da-1','ma-6'],               romanization: 'dem',     meaning: 'blood',          language: 'amharic', tier: 2 },
  { id: 'am-t2-14', fidel: 'ልብ',  charIds: ['la-6','ba-6'],               romanization: 'lɨb',     meaning: 'heart',          language: 'amharic', tier: 2 },
  { id: 'am-t2-15', fidel: 'ጓደኛ', charIds: ['ga-4','da-1','nya-4'],       romanization: 'gwadeña', meaning: 'friend',         language: 'amharic', tier: 2 },

  // ═══════════════════════════════════════════════════════════════
  // AMHARIC — Tier 3 (4+ characters)
  // ═══════════════════════════════════════════════════════════════
  { id: 'am-t3-01', fidel: 'ወዳጅ',  charIds: ['wa-1','da-4','ja-6'],           romanization: 'wedaq',   meaning: 'friend / beloved', language: 'amharic', tier: 3 },
  { id: 'am-t3-02', fidel: 'ከተማ',  charIds: ['ka-1','ta-1','ma-4'],           romanization: 'ketema',  meaning: 'city',             language: 'amharic', tier: 3 },
  { id: 'am-t3-03', fidel: 'ምሽት',  charIds: ['ma-6','sha-6','ta-6'],          romanization: 'mɨshet',  meaning: 'evening',          language: 'amharic', tier: 3 },
  { id: 'am-t3-04', fidel: 'ጨረቃ',  charIds: ['ccha-1','ra-1','qa-4'],         romanization: 'č̣ereqa', meaning: 'moon',             language: 'amharic', tier: 3 },
  { id: 'am-t3-05', fidel: 'ሌሊት',  charIds: ['la-5','la-3','ta-6'],           romanization: 'lelit',   meaning: 'night',            language: 'amharic', tier: 3 },
  { id: 'am-t3-06', fidel: 'ሳምንት', charIds: ['sa-4','ma-6','na-6','ta-6'],    romanization: 'samɨnt',  meaning: 'week',             language: 'amharic', tier: 3 },
  { id: 'am-t3-07', fidel: 'ቤተሰብ', charIds: ['ba-5','ta-1','sa-1','ba-6'],    romanization: 'beteseb', meaning: 'family',           language: 'amharic', tier: 3 },
  { id: 'am-t3-08', fidel: 'ትምህርት',charIds: ['ta-6','ma-6','ha-6','ra-6','ta-6'], romanization: 'tɨmhɨrt', meaning: 'education',     language: 'amharic', tier: 3 },
  { id: 'am-t3-09', fidel: 'አመት',  charIds: ['a-1','ma-1','ta-6'],            romanization: 'amet',    meaning: 'year',             language: 'amharic', tier: 3 },
  { id: 'am-t3-10', fidel: 'ደስታ',  charIds: ['da-1','sa-6','ta-4'],           romanization: 'desta',   meaning: 'happiness',        language: 'amharic', tier: 3 },

  // ═══════════════════════════════════════════════════════════════
  // TIGRINYA — Tier 1 (2 characters)
  // ═══════════════════════════════════════════════════════════════
  { id: 'ti-t1-01', fidel: 'ቤት',  charIds: ['ba-5','ta-6'],        romanization: 'bet',    meaning: 'house',          language: 'tigrinya', tier: 1 },
  { id: 'ti-t1-02', fidel: 'ማይ',  charIds: ['ma-4','ya-6'],        romanization: 'may',    meaning: 'water',          language: 'tigrinya', tier: 1 },
  { id: 'ti-t1-03', fidel: 'ጸሓይ', charIds: ['tsa-1','hha-4','ya-6'], romanization: 'ṣɨhay', meaning: 'sun',            language: 'tigrinya', tier: 1 },
  { id: 'ti-t1-04', fidel: 'ዕለት', charIds: ['aa-6','la-1','ta-6'], romanization: 'ʕɨlet',  meaning: 'day',            language: 'tigrinya', tier: 1 },
  { id: 'ti-t1-05', fidel: 'ወርሒ', charIds: ['wa-1','ra-6','ha-3'], romanization: 'werḥi',  meaning: 'month',          language: 'tigrinya', tier: 1 },
  { id: 'ti-t1-06', fidel: 'ዓይኒ', charIds: ['aa-4','ya-6','na-3'], romanization: 'ayni',   meaning: 'eye',            language: 'tigrinya', tier: 1 },
  { id: 'ti-t1-07', fidel: 'ደም',  charIds: ['da-1','ma-6'],        romanization: 'dem',    meaning: 'blood',          language: 'tigrinya', tier: 1 },
  { id: 'ti-t1-08', fidel: 'ልቢ',  charIds: ['la-6','ba-3'],        romanization: 'lɨbi',   meaning: 'heart',          language: 'tigrinya', tier: 1 },
  { id: 'ti-t1-09', fidel: 'ናይ',  charIds: ['na-4','ya-6'],        romanization: 'nay',    meaning: 'of (possessive)', language: 'tigrinya', tier: 1 },
  { id: 'ti-t1-10', fidel: 'ሕጂ',  charIds: ['hha-6','ja-3'],       romanization: 'ḥɨji',   meaning: 'now',            language: 'tigrinya', tier: 1 },

  // ═══════════════════════════════════════════════════════════════
  // TIGRINYA — Tier 2 (3 characters)
  // ═══════════════════════════════════════════════════════════════
  { id: 'ti-t2-01', fidel: 'ሰላም', charIds: ['sa-1','la-4','ma-6'],        romanization: 'selam',   meaning: 'hello / peace',  language: 'tigrinya', tier: 2 },
  { id: 'ti-t2-02', fidel: 'ሓደ',  charIds: ['hha-4','da-1'],              romanization: 'ḥade',    meaning: 'one',            language: 'tigrinya', tier: 2 },
  { id: 'ti-t2-03', fidel: 'ከተማ', charIds: ['ka-1','ta-1','ma-4'],        romanization: 'ketema',  meaning: 'city',           language: 'tigrinya', tier: 2 },
  { id: 'ti-t2-04', fidel: 'ሃገር', charIds: ['ha-4','ga-1','ra-6'],        romanization: 'hager',   meaning: 'country',        language: 'tigrinya', tier: 2 },
  { id: 'ti-t2-05', fidel: 'ወሰን', charIds: ['wa-1','sa-1','na-6'],        romanization: 'wesen',   meaning: 'border / limit', language: 'tigrinya', tier: 2 },
  { id: 'ti-t2-06', fidel: 'ምግቢ', charIds: ['ma-6','ga-6','ba-3'],        romanization: 'mɨgɨbi',  meaning: 'food',           language: 'tigrinya', tier: 2 },
  { id: 'ti-t2-07', fidel: 'ወተት', charIds: ['wa-1','ta-1','ta-6'],        romanization: 'wetet',   meaning: 'milk',           language: 'tigrinya', tier: 2 },
  { id: 'ti-t2-08', fidel: 'ዳቦ',  charIds: ['da-4','ba-7'],               romanization: 'dabo',    meaning: 'bread',          language: 'tigrinya', tier: 2 },
  { id: 'ti-t2-09', fidel: 'ጓሕቲ', charIds: ['ga-4','hha-6','ta-3'],       romanization: 'gwaḥɨti', meaning: 'friend (f)',     language: 'tigrinya', tier: 2 },
  { id: 'ti-t2-10', fidel: 'ዓወት', charIds: ['aa-4','wa-1','ta-6'],        romanization: 'awet',    meaning: 'victory',        language: 'tigrinya', tier: 2 },

  // ═══════════════════════════════════════════════════════════════
  // TIGRINYA — Tier 3 (4+ characters)
  // ═══════════════════════════════════════════════════════════════
  { id: 'ti-t3-01', fidel: 'ሰናይ',  charIds: ['sa-1','na-4','ya-6'],        romanization: 'senay',   meaning: 'good / beautiful', language: 'tigrinya', tier: 3 },
  { id: 'ti-t3-02', fidel: 'ስድራቤት',charIds: ['sa-6','da-6','ra-4','ba-5','ta-6'], romanization: 'sɨdrabet', meaning: 'family',     language: 'tigrinya', tier: 3 },
  { id: 'ti-t3-03', fidel: 'ደስታ',  charIds: ['da-1','sa-6','ta-4'],        romanization: 'desta',   meaning: 'happiness',        language: 'tigrinya', tier: 3 },
  { id: 'ti-t3-04', fidel: 'ምሸት',  charIds: ['ma-6','sha-1','ta-6'],       romanization: 'mɨshet',  meaning: 'evening',          language: 'tigrinya', tier: 3 },
  { id: 'ti-t3-05', fidel: 'ለይቲ',  charIds: ['la-1','ya-6','ta-3'],        romanization: 'leyti',   meaning: 'night',            language: 'tigrinya', tier: 3 },
]

export function getWordsForLanguage(lang: 'amharic' | 'tigrinya'): FidelWord[] {
  return WORDS.filter(w => w.language === lang)
}

export function getWordsByTier(lang: 'amharic' | 'tigrinya'): Map<number, FidelWord[]> {
  const map = new Map<number, FidelWord[]>()
  getWordsForLanguage(lang).forEach(w => {
    const arr = map.get(w.tier) ?? []
    arr.push(w)
    map.set(w.tier, arr)
  })
  return map
}
