# Fidel — Learn to Read Ge'ez Script

A production-ready progressive web app for learning to **read** the Ethiopic (Ge'ez/Fidel) script, built for people who already **speak** Amharic or Tigrinya but cannot read the characters.

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # run SRS unit tests
npm run build      # production build (PWA)
```

---

## Learning methodology

### The core insight
Fidel is an abugida — each character encodes a consonant+vowel pair. There are ~34 base consonant families, each with 7 vowel-order forms, producing ~238 characters. The key: **once a learner knows the base consonant shape and the 7 vowel modification patterns, they can decode any character** by combining the two. The app teaches the system, not 238 isolated symbols.

### Evidence-based techniques used

| Technique | Implementation |
|-----------|----------------|
| **Spaced repetition (SM-2)** | Characters you struggle with appear more often; mastered ones space out over days/weeks |
| **Active recall** | Always test retrieval — never passive review. Two directions: see character → recall sound, hear sound → pick character |
| **Pattern teaching** | Consonant families are taught as a group: learn the base shape, then see all 7 vowel modifications together |
| **Interleaving** | Multiple-choice distractors are drawn from other families (cross-family discrimination) and from the same family (vowel-order discrimination) |
| **Errorless-to-effortful** | Learn mode → recognition quiz → spaced practice queue, progressively harder |
| **Immediate audio feedback** | Every character plays its romanization on answer via Web Speech API |
| **Real-word decoding** | Reading mode uses words the learner already knows: ሰላም, ቤት, ዳቦ... reading feels like unlocking something familiar |

---

## App structure

```
Onboarding → language picker (Amharic / Tigrinya) → profile setup
Learn      → consonant families grouped by frequency; vowel-order reveal; quiz
Practice   → SM-2 spaced repetition review queue (due cards only)
Read       → tap-to-decode real words, tier 1→2→3 by character count
Progress   → full Fidel grid coloured by mastery; per-family stats
```

---

## Codebase layout

```
src/
  data/
    fidel.ts          Complete Fidel dataset: 34 families × 7 orders = 238 chars
    words.ts          50+ Amharic & Tigrinya words with character breakdowns
    types.ts          Shared TypeScript types
  srs/
    sm2.ts            SM-2 algorithm (pure functions, no side effects)
    sm2.test.ts       20 unit tests covering all SM-2 behaviours
    queue.ts          Review queue builder + multiple-choice distractor picker
  storage/
    db.ts             IndexedDB persistence via idb (works fully offline)
  audio/
    speech.ts         Web Speech API wrapper — speaks romanization text
  store/
    useAppStore.ts    Zustand store wiring state <-> IndexedDB
  components/
    AudioButton       Play romanization via Web Speech API
    CharacterCard     Single character display with optional audio
    FidelGrid         Full 34x7 grid coloured by mastery level
    Navigation        Bottom tab bar with due-card badge
  pages/
    Onboarding        Language selection, name, intro
    Learn             Family intro -> vowel-order reveal -> quiz
    Practice          SRS session with char/sound flashcards
    Reading           Tap-to-reveal word decoder
    Progress          Grid overview + per-family detail
```

---

## Adding native audio recordings

The app currently uses Web Speech API (browser TTS) for all audio. To replace with real native recordings:

1. **File naming convention**

   ```
   public/audio/chars/<characterId>.mp3    e.g. public/audio/chars/sa-1.mp3
   public/audio/words/<wordId>.mp3         e.g. public/audio/words/am-t2-01.mp3
   ```

   Character IDs follow the pattern `<familyId>-<order>` (e.g. `sa-1` = ሰ, `la-4` = ላ).
   The full list is in `src/data/fidel.ts`.

2. **Update the audio module** (`src/audio/speech.ts`)

   Replace `speakCharacter` and `speakWord` with file playback:

   ```typescript
   export async function speakCharacter(id: string, _language: Language): Promise<void> {
     const audio = new Audio(`/audio/chars/${id}.mp3`)
     return audio.play()
   }

   export async function speakWord(id: string, _language: Language): Promise<void> {
     const audio = new Audio(`/audio/words/${id}.mp3`)
     return audio.play()
   }
   ```

3. **Recommended recording specs**
   - Format: MP3, 128 kbps mono
   - Duration: 0.5-1.5 s per character, 1-3 s per word
   - Speaker: native speaker of Amharic or Tigrinya (record separate sets)
   - Silence padding: 50 ms before/after

---

## Extending the content

### Adding words
Edit `src/data/words.ts`. Each word needs:
```typescript
{
  id: 'am-t2-XX',           // unique, follow the naming pattern
  fidel: 'ምሳ',              // Ethiopic text
  charIds: ['ma-6','sa-4'],  // one ID per Fidel character
  romanization: 'mɨsa',
  meaning: 'lunch',
  language: 'amharic',
  tier: 2,                   // 1=2chars, 2=3chars, 3=4+chars
}
```

### Adding a language
1. Add `'geez'` to the `Language` type in `src/data/types.ts`
2. Tag relevant families in `src/data/fidel.ts` with the new language
3. Add words in `src/data/words.ts`
4. Add the option to the language picker in `src/pages/Onboarding.tsx`

---

## PWA / offline use

The app installs as a PWA on iOS and Android (Add to Home Screen). After the first load all assets are cached via Workbox — it works fully offline including the Ethiopic font (cached after first visit).

---

## Tech stack

| Layer | Choice | Why |
|-------|--------|-----|
| Build | Vite + React 19 + TypeScript | Fast DX, strict types |
| Styling | Tailwind v4 + Fraunces / Inter / Noto Sans Ethiopic | Typography hierarchy, Ethiopic-first font support |
| State | Zustand | Minimal boilerplate, selector-based subscriptions |
| Persistence | IndexedDB via idb | Works offline, no size limits |
| SRS | SM-2 | Proven, simple, testable — right for ~238 card decks |
| Audio | Web Speech API | Zero assets, works offline, replaceable with recordings |
| PWA | vite-plugin-pwa + Workbox | Installable, fully offline, asset caching |
| Testing | Vitest | Co-located with Vite, fast |
