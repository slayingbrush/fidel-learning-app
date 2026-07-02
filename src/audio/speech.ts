/**
 * Web Speech API wrapper for Fidel character and word pronunciation.
 *
 * Speaks romanization text using available voices. Prefers 'am-ET' (Amharic)
 * or 'ti-ET' (Tigrinya) voices when available; falls back to a neutral voice.
 *
 * Native audio recordings can replace this entirely by placing mp3 files at
 * /audio/<characterId>.mp3 and /audio/words/<wordId>.mp3 — see README.
 */

import type { Language } from '../data/types'

let voices: SpeechSynthesisVoice[] = []

function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise(resolve => {
    const v = window.speechSynthesis.getVoices()
    if (v.length > 0) { voices = v; resolve(v); return }

    // Some browsers never fire onvoiceschanged — resolve after 1 s regardless
    const fallback = setTimeout(() => {
      voices = window.speechSynthesis.getVoices()
      resolve(voices)
    }, 1000)

    window.speechSynthesis.onvoiceschanged = () => {
      clearTimeout(fallback)
      voices = window.speechSynthesis.getVoices()
      resolve(voices)
    }
  })
}

function pickVoice(language: Language): SpeechSynthesisVoice | null {
  const langCode = language === 'amharic' ? 'am' : 'ti'
  return (
    voices.find(v => v.lang.startsWith(langCode)) ??
    voices.find(v => v.lang.startsWith('en')) ??
    voices[0] ??
    null
  )
}

const SPEECH_TIMEOUT_MS = 8_000

export async function speakText(text: string, language: Language): Promise<void> {
  if (!text || !('speechSynthesis' in window)) return
  if (voices.length === 0) await loadVoices()

  window.speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.voice = pickVoice(language)
  utterance.rate = 0.85
  utterance.pitch = 1.0
  utterance.volume = 1.0

  // Race against a timeout: some Chromium builds never fire onend
  return Promise.race([
    new Promise<void>(resolve => {
      utterance.onend = () => resolve()
      utterance.onerror = () => resolve()
      window.speechSynthesis.speak(utterance)
    }),
    new Promise<void>(resolve => setTimeout(resolve, SPEECH_TIMEOUT_MS)),
  ])
}

export async function speakCharacter(romanization: string, language: Language): Promise<void> {
  return speakText(romanization, language)
}

export async function speakWord(romanization: string, language: Language): Promise<void> {
  return speakText(romanization, language)
}

export function cancelSpeech(): void {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel()
}

export function isSpeechAvailable(): boolean {
  return 'speechSynthesis' in window
}

// Pre-warm voices on module load
if ('speechSynthesis' in window) {
  loadVoices().catch(() => {})
}
