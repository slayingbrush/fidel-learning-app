---
name: Fidel — Learn Ge'ez Script
description: A calm, script-first learning app for Amharic and Tigrinya speakers who can read neither language.
colors:
  teal-primary: "#1B6B77"
  teal-deep: "#155f6a"
  teal-mid: "#3a9caa"
  teal-surface: "#f0f9fa"
  teal-border: "#b0e0e6"
  amber-accent: "#D4A853"
  amber-surface: "#fffbeb"
  amber-border: "#fcd34d"
  bg-warm: "#FAFAF8"
  surface: "#ffffff"
  border: "#e8e5e0"
  ink: "#1A1A1A"
  muted: "#6b7280"
  status-mastered: "#22c55e"
  status-learning: "#f59e0b"
  status-new: "#e5e7eb"
  status-error: "#ef4444"
typography:
  display:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "clamp(1.875rem, 5vw, 3rem)"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    letterSpacing: "0.025em"
  ethiopic-display:
    fontFamily: "Noto Sans Ethiopic, serif"
    fontSize: "clamp(4rem, 20vw, 8rem)"
    lineHeight: 1.1
  ethiopic-card:
    fontFamily: "Noto Sans Ethiopic, serif"
    fontSize: "clamp(2rem, 8vw, 3rem)"
    lineHeight: 1.15
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.teal-primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: "16px 24px"
  button-primary-hover:
    backgroundColor: "{colors.teal-deep}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.teal-primary}"
    rounded: "{rounded.lg}"
    padding: "12px 24px"
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
  character-card:
    backgroundColor: "{colors.teal-surface}"
    rounded: "{rounded.xl}"
    padding: "{spacing.lg}"
  choice-default:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: "{spacing.md}"
  choice-correct:
    backgroundColor: "{colors.teal-surface}"
    rounded: "{rounded.lg}"
    padding: "{spacing.md}"
  choice-wrong:
    backgroundColor: "#fef2f2"
    rounded: "{rounded.lg}"
    padding: "{spacing.md}"
---

# Design System: Fidel

## 1. Overview

**Creative North Star: "The Patient Teacher"**

Fidel is the patient teacher who sits across from an adult learner who feels quietly embarrassed about a gap in their heritage — someone who has spoken Amharic or Tigrinya their whole life but has never read a word of it. The interface does not rush them, does not congratulate them with confetti, does not demand daily streaks. It puts the script on the table, illuminates one character at a time, and waits.

The design system's central principle is that the Ethiopic characters are the content. Everything else — spacing, color, typography — exists to frame them. The background recedes. The UI retreats. The character fills the screen. When a learner taps ሰ and hears "sa," the visual moment should feel like recognition, not gamification.

This is a restrained, high-trust system. It earns confidence through clarity, not charm. Buttons are generous in size but quiet in personality. Cards are borderlined, not shadowed. Color is used to teach — teal means "this is the system working," amber means "pay attention here," green means "you have this." Color is never decorative.

**Key Characteristics:**
- Script-first: Ethiopic characters at display scale dominate every practice screen
- Three-font system: Fraunces for headings (warmth, gravitas), Inter for UI (clarity, neutrality), Noto Sans Ethiopic for characters (legibility at all sizes)
- Tonal over shadowed: depth through background tints, not drop shadows
- Mastery-coded color: teal/amber/green/gray encode learning state, not decoration
- Audio-always: every interactive character element pairs with a sound affordance

## 2. Colors: The Deep River Palette

The palette is drawn from Ethiopian landscape — the color of the Awash at dusk, the green-teal of highland water. It is never corporate, never clinical. It is grounded and earned.

### Primary
- **Deep River Teal** (`#1B6B77`): The primary action color. Used on all primary buttons, active navigation states, character displays (text color), and confirmed-correct feedback. Its rarity on neutral surfaces makes it trustworthy — when it appears, something has happened.
- **Teal Deep** (`#155f6a`): Hover state for primary teal. Slightly darker, clearly darker without being black. Used exclusively for `hover:` and `active:` states on teal buttons.
- **Teal Mid** (`#3a9caa`): Appears in progress bars, badges, and secondary teal contexts where the full primary would be too saturating.

### Secondary
- **Amber Highlight** (`#D4A853`): The attentional accent. Used for "pay attention here" moments — the locked-group badge, the learning-state dot, audio-button active state. Never used for primary actions; always a secondary signal.

### Neutral
- **Warm Near-White** (`#FAFAF8`): The page background. Intentionally not pure white — it carries the smallest warmth without tipping into cream. Named neutral, not warm, because it is an absence, not a presence.
- **Surface White** (`#ffffff`): Cards, panels, and interactive elements that sit above the page background. The contrast between `#FAFAF8` and `#ffffff` is the primary depth mechanic.
- **Border Stone** (`#e8e5e0`): The default border color. Warm-gray, slightly stone-toned. Never pure gray.
- **Ink** (`#1A1A1A`): Primary text. Near-black, not pure black. Used for headings and body copy everywhere.
- **Muted Stone** (`#6b7280`): Secondary / descriptive text. Used for subtitles, romanization labels, and supporting copy. **Must never appear on a tinted surface** — on teal-50 backgrounds, replace with `{colors.teal-primary}` or a teal-700 variant.

### State Colors
- **Mastered Green** (`#22c55e`): Appears on the Fidel grid and progress indicators for mastered characters. Never used outside of mastery context.
- **Learning Amber** (`#f59e0b`): Characters in active SRS learning. The same amber family as the secondary accent, warmer and more saturated.
- **New Gray** (`#e5e7eb`): Unstarted / locked characters. Intentionally cool and receding — it says "not yet," not "forbidden."
- **Error Red** (`#ef4444`): Wrong-answer feedback. Used only in the incorrect-choice state, never in alerts or decorative contexts.

### Named Rules
**The Muted-on-Color Rule.** Gray text (`{colors.muted}`) on any tinted surface is prohibited. On teal-50, amber-50, or any surface with a brand-colored background, use a darker shade of that surface's own hue. Muted gray on tinted white looks washed out and undermines legibility.

**The Teal Monopoly Rule.** Teal is the system's teaching color. It tells the learner "this is how the app is working." Using teal decoratively — for borders, backgrounds, or typography with no functional purpose — dilutes this signal. If teal appears, something should have happened.

## 3. Typography: The Three-Register System

**Display Font:** Fraunces (with Georgia, serif fallback)
**Body / UI Font:** Inter (with system-ui, sans-serif fallback)
**Character Font:** Noto Sans Ethiopic (with serif fallback)

**Character:** Fraunces is optically warm and slightly literary — it carries the gravitas of a heritage language without being fusty. Inter is the neutral counterpart: precise, legible, invisible. Noto Sans Ethiopic renders Ethiopic script at any size with full Unicode coverage and careful stroke weight. These three fonts are not designed to harmonize decoratively; they are designed to do three completely different jobs without interfering.

### Hierarchy
- **Display** (Fraunces, 600, `clamp(1.875rem, 5vw, 3rem)`, lh 1.1, ls -0.02em): Page-level headings only — the top of Onboarding, modal titles, completion screens. Never more than one per screen. Use `text-wrap: balance`.
- **Headline** (Inter, 600, 1.5rem, lh 1.25, ls -0.01em): Section headers within a screen (e.g., "Learn", "Practice"). Used with restraint; typically only one per page section.
- **Title** (Inter, 600, 1rem, lh 1.4): Card headings, family names in the Learn grid, word labels in Reading mode.
- **Body** (Inter, 400, 1rem, lh 1.6): All descriptive copy, instructions, definitions. Max-width 65–70ch on prose blocks.
- **Label** (Inter, 500, 0.75rem, ls 0.025em): Romanization captions under Ethiopic characters, order number labels, state indicators ("2nd order · /u/"). Never all-caps as a default.
- **Ethiopic Display** (Noto Sans Ethiopic, `clamp(4rem, 20vw, 8rem)`, lh 1.1): The character in flashcard and learn-mode. This is the hero scale — the character should feel monumental, not educational.
- **Ethiopic Card** (Noto Sans Ethiopic, `clamp(2rem, 8vw, 3rem)`, lh 1.15): Characters within the 7-order reveal grid and choice buttons.

### Named Rules
**The Script-Above-All Rule.** Ethiopic characters must always be rendered at a size and weight that makes them fully legible without zooming. Never reduce character size for information density. If the layout is crowded, remove UI elements — not character size.

**The Fraunces Ceiling Rule.** Fraunces appears only on page-level display headings. It is prohibited as a body font, label font, or anywhere Interactive. Its warmth is a scent, not a flavor — use it sparingly so it reads as distinct.

## 4. Elevation

The Fidel system is flat by default. Depth is conveyed through tonal layering: `{colors.bg-warm}` as the page floor, `{colors.surface}` as the card layer, `{colors.teal-surface}` as the character-display layer. This creates a three-tier hierarchy without any shadows at all.

Shadows appear only as a **response to state**, not at rest:
- Primary buttons carry a soft ambient shadow at rest (`box-shadow: 0 4px 12px rgba(27, 107, 119, 0.18)`) that emphasizes their importance on a flat page.
- Interactive cards receive `hover:shadow-md` (a soft neutral shadow) as a hover affordance — the visual response that says "this is tappable."

### Shadow Vocabulary
- **Button ambient** (`0 4px 12px rgba(27, 107, 119, 0.18)`): Soft teal-tinted shadow on primary buttons. Its tinting toward the button's own color makes it feel integrated, not dropped.
- **Card hover** (`0 4px 12px rgba(0, 0, 0, 0.08)`): Neutral gray-black shadow on hover. Appears on word cards, family cards, and choice buttons on hover only — never at rest.

### Named Rules
**The Flat-at-Rest Rule.** All surfaces are flat at rest except primary buttons. Shadows are interaction responses, not decoration. If an element has a shadow without being hovered or focused, remove it.

## 5. Components

### Buttons
Buttons are the learner's primary commitment gesture — "I'm choosing this character," "I want to start." They should feel solid and considered, not playful.

- **Shape:** Gently rounded (16px radius). Not pill-shaped — pill shape reads as playful. Not square — square reads as utilitarian. 16px is calm and resolved.
- **Primary:** Deep River Teal (`#1B6B77`) background, white text (`#ffffff`), full-width on mobile (matches the learning interaction pattern), 16px vertical padding. Ambient teal shadow at rest.
- **Hover / Active:** Background shifts to `{colors.teal-deep}` (`#155f6a`). Scale to 95% on press (`active:scale-95`). No color shift on mobile (no persistent hover state). Shadow disappears on press.
- **Disabled:** Opacity 40%, cursor not-allowed. Teal family preserved — never replaced with gray. The teal at 40% says "not yet," not "unavailable forever."
- **Ghost:** Transparent background, teal text, no border. Used for secondary actions like "Skip" and "Back." Never competes with primary.

### Cards / Containers
Cards are the neutral containers for content — they should disappear behind the content they hold.

- **Shape:** 16px radius (`{rounded.lg}`).
- **Background:** Surface white (`{colors.surface}`).
- **Shadow Strategy:** None at rest. `card-hover` shadow on hover for interactive cards.
- **Border:** `1px solid {colors.border}` — present on all cards. The border is a locator, not a decorator. It tells the learner where the card is without adding visual weight.
- **Internal Padding:** 16–24px (`{spacing.md}` to `{spacing.lg}`).

### Character Card
The signature component. The Ethiopic character is the content.

- **Shape:** 24px radius (`{rounded.xl}`). Slightly rounder than standard cards — softens the visual container so the character reads as foregrounded.
- **Background:** Teal surface (`{colors.teal-surface}`). The character "lives" in the teal space.
- **Border:** `2px solid {colors.teal-border}`. Slightly thicker than standard cards — the added weight frames the character.
- **Character size:** `clamp(4rem, 20vw, 8rem)` — the maximum that fits on screen. Never reduced for density.
- **Audio pairing:** Every character card that is interactive includes an `AudioButton`. Sound and symbol are always together.

### Multiple Choice Buttons
Used in Learn quiz and Practice sessions. Must clearly communicate selection state without relying on color alone.

- **Default:** White background, 2px `{colors.border}` border, 16px radius.
- **Correct:** `{colors.teal-surface}` background, 2px `{colors.teal-primary}` border. The border thickens to 2px from 1px as part of the state change.
- **Incorrect selected:** `#fef2f2` background, 2px `{colors.status-error}` border.
- **Correct (revealed, not selected):** Same as Correct state — the right answer is always highlighted once any choice is made.
- **Active press:** `scale-95` transform. Confirms the gesture.

### Fidel Grid
The Progress screen's defining visual. 34 rows × 7 columns of character buttons, color-coded by mastery state.

- **Character button:** 44×44px (`{spacing.xl}` minimum tap target), 8px radius, font-ethiopic.
- **New:** `{colors.status-new}` background, gray text — receding, says "not started."
- **Learning:** Amber surface background (`#fffbeb`), `{colors.amber-accent}` text.
- **Mastered:** Teal surface background (`{colors.teal-surface}`), `{colors.teal-primary}` text.
- **Hover:** `scale-110` with neutral shadow. Communicates the cell is tappable without a hover indicator.

### Navigation (Bottom Tab Bar)
Fixed bottom bar, mobile-first, four tabs.

- **Background:** `{colors.surface}` with top `1px {colors.border}` border.
- **Inactive:** `{colors.muted}` icon and label. 10px label font-size (below Inter's normal floor — acceptable because it is a label beneath an icon, not body copy).
- **Active:** `{colors.teal-primary}` icon and label. Icon stroke-width increases from 2 to 2.5 on active.
- **Due badge:** Amber (`{colors.amber-accent}`) dot/pill on the Practice tab when cards are due. Amber is the attentional accent — it earns this role.
- **Tap target:** Full tab area is tappable, 48px minimum height.

### Audio Button
Circular icon button that plays romanization via Web Speech API.

- **Resting:** Teal-50 background, teal-600 icon.
- **Playing:** Teal-600 background, white icon, scale 95%. The inversion signals active state.
- **Sizes:** sm (32px), md (44px), lg (56px). Scale by context — lead instruction screens use lg; inline card labels use sm.

## 6. Do's and Don'ts

### Do:
- **Do** render Ethiopic characters at a minimum of 2rem (32px) in any context where the learner should read them. Below that, the characters are decorative, not legible.
- **Do** use teal (`{colors.teal-primary}`) to signal system state: active, correct, unlocked, selected. Reserve it for meaning.
- **Do** keep `{colors.muted}` (`#6b7280`) on white or near-white surfaces only. On any tinted background, switch to the tinted surface's own dark shade.
- **Do** pair every interactive Ethiopic character with an audio affordance. Sound is the bridge; removing it breaks the app's core mechanism.
- **Do** give buttons at least 48px touch height on mobile. The learner is tapping while studying — fat-finger forgiveness is respect for the user's context.
- **Do** use `disabled:opacity-40` with the primary color preserved for disabled states. A 40%-opacity teal button reads as "not yet." A gray button reads as "unavailable."
- **Do** preserve the three-tier depth system: `{colors.bg-warm}` floor → `{colors.surface}` cards → `{colors.teal-surface}` character displays. Never collapse these layers.

### Don't:
- **Don't** use children's-app aesthetics: no bright primary-color palettes, no bubbly rounded fonts, no bouncing or pulsing character mascots, no confetti on correct answers. The learner is an adult. The app must treat them as one.
- **Don't** introduce gamification mechanics: no streak counters threatening loss, no XP bars, no level-up animations, no sound effects for correct answers that reward the action rather than reinforcing the learning.
- **Don't** use gray text on any colored background. `text-gray-*` on `teal-50`, `amber-50`, or any tinted surface is prohibited. Swap to the surface's own dark hue.
- **Don't** render Ethiopic characters at less than 2rem (32px) in interactive contexts. Shrinking the characters for layout density inverts the product's core principle.
- **Don't** use Fraunces for UI labels, buttons, navigation, or any text below 1.5rem. Its warmth disappears at small size and it reads as a mis-used serif instead of a chosen display font.
- **Don't** add shadows to cards, panels, or containers at rest. Shadows appear only on hover (interactive affordance) or on primary buttons (anchoring weight). Decorative shadows add visual noise that fights the characters.
- **Don't** use amber (`{colors.amber-accent}`) for primary actions. Amber is an attention signal ("something here needs your focus"), not an action signal. Primary actions are always teal.
- **Don't** remove the audio button from interactive character displays. Every character that can be tapped must be speakable. Audio-first is a non-negotiable accessibility commitment.
