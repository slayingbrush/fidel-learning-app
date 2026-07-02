import { useState, useEffect, useRef } from 'react'
import { speakText, cancelSpeech } from '../audio/speech'
import type { Language } from '../data/types'

interface Props {
  text: string
  language: Language
  size?: 'sm' | 'md' | 'lg'
  label?: string
  className?: string
}

export function AudioButton({ text, language, size = 'md', label, className = '' }: Props) {
  const [playing, setPlaying] = useState(false)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      cancelSpeech()
    }
  }, [])

  const play = async () => {
    if (playing) return
    setPlaying(true)
    await speakText(text, language)
    if (mountedRef.current) setPlaying(false)
  }

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-11 h-11 text-base',
    lg: 'w-14 h-14 text-xl',
  }

  return (
    <button
      onClick={play}
      aria-label={label ?? `Play audio for ${text}`}
      className={`tap-target inline-flex items-center justify-center rounded-full transition-all
        ${playing
          ? 'bg-teal-600 text-white scale-95'
          : 'bg-teal-50 text-teal-600 hover:bg-teal-100 active:scale-95'}
        ${sizeClasses[size]} ${className}`}
    >
      {playing ? (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-1/2 h-1/2">
          <rect x="6" y="5" width="4" height="14" rx="1" />
          <rect x="14" y="5" width="4" height="14" rx="1" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-1/2 h-1/2">
          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
          <path d="M14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77 0-4.28-2.99-7.86-7-8.77z" />
        </svg>
      )}
    </button>
  )
}
