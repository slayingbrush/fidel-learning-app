# Product

## Register

product

## Users

Adult heritage speakers and diaspora learners who speak Amharic or Tigrinya fluently
but have never learned to read the Ge'ez/Fidel script. Their context: self-directed,
often on a phone, frequently embarrassed about the gap — they grew up hearing the
language but were never formally taught the script. Many are in regions with limited
or intermittent connectivity.

## Product Purpose

Fidel teaches speakers to decode the Ethiopic script by leveraging what they already
know: the sounds. Every session maps a character to a sound they already produce.
Success looks like a user opening a familiar word like ሰላም and reading it aloud
unprompted — not from memory of the word shape, but from decoding each character.

The core mechanism: teach the system (34 consonant families × 7 vowel orders = a
learnable grid), not 238 isolated symbols. Spaced repetition ensures what's learned
is retained. Reading real known words (not nonsense syllables) makes progress feel
immediate.

## Brand Personality

Calm. Trustworthy. Unlocking.

The app sits next to the user at the moment they feel most self-conscious about a
gap in their heritage. The tone is that of a patient older sibling, not a teacher
grading them, not a children's app entertaining them. Every word of copy and every
design choice should feel like a quiet vote of confidence.

## Anti-references

- Children's education apps: no bright primary colors, bubbly rounded fonts,
  bouncing characters, confetti, or condescending congratulatory copy.
  The learner is an adult. Treat them like one.
- Gamified language apps (Duolingo aesthetic): no streak-pressure, no XP bars,
  no cartoon mascots, no urgent "you'll lose your streak!" mechanics.
  Progress should feel earned, not coerced.

## Design Principles

1. **The script is the hero.** Every layout decision should give Fidel characters
   the visual weight they deserve. Characters must read at a glance; never shrink
   them for information density.

2. **Calm is not boring.** Restraint in color and layout creates focus, not
   emptiness. Empty space around a character is not wasted space — it is respect.

3. **Audio is the bridge.** The user already knows the sounds. Every interaction
   should reinforce the sound↔symbol link. Audio is not a feature; it is the core
   mechanism.

4. **Progress should be visible, not pressured.** The Fidel grid filling in as
   characters are mastered is intrinsically motivating. Avoid any mechanic that
   creates anxiety (countdowns, loss of progress, daily minimums). Show what was
   gained, not what wasn't.

5. **Offline is a feature, not a fallback.** For users in Ethiopia, Eritrea, and
   the diaspora on variable connections, an app that works everywhere is an
   accessibility feature, not a nice-to-have.

## Accessibility & Inclusion

No formal WCAG compliance target, but the following are non-negotiable in practice:
- High contrast body text (aim for the spirit of WCAG AA: 4.5:1+)
- Large tap targets (≥ 48px) on all interactive elements
- Large, clear Ethiopic character display using Noto Sans Ethiopic
- Audio-first: every character and instruction is speakable so low-literacy
  users are never blocked by written instructions alone
- Works fully offline as a PWA (critical for connectivity-limited users)
- No animation that cannot be disabled (respects prefers-reduced-motion)
