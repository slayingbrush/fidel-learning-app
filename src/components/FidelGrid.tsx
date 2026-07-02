import { VOWEL_ORDER_INFO } from '../data/types'
import type { ConsonantFamily, VowelOrder } from '../data/types'
import { masteryLevel } from '../srs/sm2'
import type { CardData } from '../srs/sm2'

interface Props {
  families: ConsonantFamily[]
  cardStates: Record<string, CardData>
  onCharClick?: (charId: string) => void
}

const masteryColors = {
  new:      'bg-gray-100 text-gray-400 border-gray-200',
  learning: 'bg-amber-50 text-amber-700 border-amber-300',
  mastered: 'bg-teal-50 text-teal-700 border-teal-300',
}

const masteryDot = {
  new:      'bg-gray-300',
  learning: 'bg-amber-400',
  mastered: 'bg-teal-500',
}

export function FidelGrid({ families, cardStates, onCharClick }: Props) {
  const orders = [1, 2, 3, 4, 5, 6, 7] as VowelOrder[]

  return (
    <div className="overflow-x-auto">
      <table className="border-separate border-spacing-1 mx-auto">
        <thead>
          <tr>
            <th scope="col" className="text-left pr-3 pb-2">
              <span className="text-xs font-sans text-gray-400 font-medium">Family</span>
            </th>
            {orders.map(o => (
              <th key={o} scope="col" className="pb-2 min-w-[3rem]">
                <div className="flex flex-col items-center gap-0.5">
                  <span className="text-[10px] font-sans text-gray-400 font-medium">
                    {o}
                  </span>
                  <span className="text-[10px] font-sans text-gray-500">
                    {VOWEL_ORDER_INFO[o].vowel}
                  </span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {families.map(family => (
            <tr key={family.id}>
              <td className="pr-3">
                <span className="text-xs font-sans text-gray-500 whitespace-nowrap font-medium">
                  {family.consonantRomanization}
                </span>
              </td>
              {family.chars.map(char => {
                const card = cardStates[char.id]
                const level = card ? masteryLevel(card) : 'new'
                return (
                  <td key={char.id}>
                    <button
                      onClick={() => onCharClick?.(char.id)}
                      aria-label={`${char.char} — ${char.romanization}`}
                      title={`${char.char} — ${char.romanization}`}
                      className={`
                        w-11 h-11 rounded-lg border font-ethiopic text-xl
                        flex items-center justify-center transition-all
                        hover:scale-110 hover:shadow-sm active:scale-100
                        tap-target ${masteryColors[level]}
                      `}
                    >
                      {char.char}
                    </button>
                  </td>
                )
              })}
              <td className="pl-2">
                <div className={`w-2 h-2 rounded-full ${masteryDot[
                  family.chars.every(c => {
                    const card = cardStates[c.id]
                    return card && masteryLevel(card) === 'mastered'
                  }) ? 'mastered'
                    : family.chars.some(c => cardStates[c.id]) ? 'learning'
                    : 'new'
                ]}`} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
