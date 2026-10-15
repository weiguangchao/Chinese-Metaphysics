import type { ReactNode } from 'react'
import type { Chart, Element, PillarView } from '../bazi/chart'
import { ELEMENT_EMOJI, ELEMENT_TEXT } from './elementStyles'

const DAY_PILLAR = 2

export function PillarsTable({ chart }: { chart: Chart }) {
  const dayMasterLabel = chart.gender === 'male' ? '元男' : '元女'
  const row = (label: string, render: (p: PillarView, i: number) => ReactNode, className = '') => (
    <>
      <div className="flex items-center text-xs text-stone-400 sm:text-sm">{label}</div>
      {chart.pillars.map((p, i) => (
        <div
          key={p.label}
          className={`flex flex-col items-center justify-center ${i === DAY_PILLAR ? 'bg-stone-200/60' : ''} ${className}`}
        >
          {render(p, i)}
        </div>
      ))}
    </>
  )

  return (
    <div className="grid grid-cols-[2.5rem_repeat(4,1fr)] sm:grid-cols-[4rem_repeat(4,1fr)]">
      {row('', (p) => p.label, 'pt-3 pb-1 text-sm text-stone-500 rounded-t-xl')}
      {row('主星', (p, i) => (i === DAY_PILLAR ? dayMasterLabel : p.stem.tenStar), 'py-1 text-sm text-stone-700')}
      {row(
        '天干',
        (p) => <BigChar name={p.stem.name} element={p.stem.element} />,
        'py-1',
      )}
      {row(
        '地支',
        (p) => <BigChar name={p.branch.name} element={p.branch.element} />,
        'py-1',
      )}
      {row(
        '藏干',
        (p) => (
          <ul className="flex flex-col items-center gap-0.5 py-2 text-xs sm:text-sm">
            {p.hiddenStems.map((h) => (
              <li key={h.name} title={h.type}>
                <span className={`font-serif font-semibold ${ELEMENT_TEXT[h.element]}`}>{h.name}</span>
                <span className="ml-1 text-stone-600">{h.tenStar}</span>
              </li>
            ))}
          </ul>
        ),
        'justify-start',
      )}
      {row('星运', (p) => p.terrain, 'py-1.5 text-sm')}
      {row('自坐', (p) => p.selfTerrain, 'pt-1.5 pb-3 text-sm rounded-b-xl')}
    </div>
  )
}

function BigChar({ name, element }: { name: string; element: Element }) {
  return (
    <span className="relative inline-block leading-none">
      <span className={`font-serif text-4xl font-semibold sm:text-5xl ${ELEMENT_TEXT[element]}`}>{name}</span>
      <span role="img" aria-label={element} className="absolute bottom-0 -right-5 text-sm leading-none sm:-right-8 sm:text-xl">
        {ELEMENT_EMOJI[element]}
      </span>
    </span>
  )
}
