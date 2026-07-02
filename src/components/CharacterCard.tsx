import { AudioButton } from './AudioButton'
import type { FidelChar } from '../data/types'
import type { Language } from '../data/types'
import { VOWEL_ORDER_INFO } from '../data/types'

interface Props {
  char: FidelChar
  language: Language
  showRomanization?: boolean
  showOrder?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl'
  highlight?: boolean
  onClick?: () => void
  className?: string
}

const sizeMap = {
  sm:  { char: 'text-3xl',  card: 'p-3 min-w-[4rem]',  roman: 'text-xs' },
  md:  { char: 'text-5xl',  card: 'p-4 min-w-[6rem]',  roman: 'text-sm' },
  lg:  { char: 'text-7xl',  card: 'p-6 min-w-[8rem]',  roman: 'text-base' },
  xl:  { char: 'text-[8rem] leading-none', card: 'p-8 min-w-[12rem]', roman: 'text-lg' },
}

export function CharacterCard({
  char, language, showRomanization = true, showOrder = false,
  size = 'md', highlight = false, onClick, className = '',
}: Props) {
  const s = sizeMap[size]
  const orderInfo = VOWEL_ORDER_INFO[char.order]

  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onClick ? e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick() } } : undefined}
      className={`
        flex flex-col items-center gap-2 rounded-2xl border transition-all select-none
        ${onClick ? 'tap-target cursor-pointer hover:shadow-md active:scale-95' : ''}
        ${highlight
          ? 'border-teal-500 bg-teal-50 shadow-md shadow-teal-100'
          : 'border-[var(--color-border)] bg-white'}
        ${s.card} ${className}
      `}
    >
      <span className={`font-ethiopic ${s.char} text-teal-700 leading-tight`}>
        {char.char}
      </span>

      {showRomanization && (
        <div className="flex flex-col items-center gap-0.5">
          <span className={`font-sans font-semibold text-teal-600 ${s.roman}`}>
            {char.romanization}
          </span>
          {showOrder && (
            <span className="text-[10px] text-gray-400 font-sans">
              {orderInfo.name} · /{char.ipa}/
            </span>
          )}
        </div>
      )}

      {onClick && (
        <AudioButton text={char.romanization} language={language} size="sm" />
      )}
    </div>
  )
}
