import { useState } from 'react'
import type { Chart, FortuneBranchView, StemView } from '../chart/chart'
import { ELEMENT_TEXT } from './elementStyles'

const currentYear = new Date().getFullYear()

const TEN_STAR_SHORT: Record<string, string> = {
  比肩: '比',
  劫财: '劫',
  食神: '食',
  伤官: '伤',
  偏财: '才',
  正财: '财',
  七杀: '杀',
  正官: '官',
  偏印: '枭',
  正印: '印',
}

export function FortunePanel({ chart }: { chart: Chart }) {
  const { decades } = chart
  const currentIndex = decades.findIndex((d) => d.startYear <= currentYear && currentYear <= d.endYear)
  const [picked, setPicked] = useState<number | null>(null)
  const selected = picked ?? Math.max(currentIndex, 0)
  const decade = decades[selected]

  return (
    <div className="flex flex-col gap-6">
      <section>
        <div className="mb-3 flex items-baseline justify-between gap-4 text-sm text-stone-500 dark:text-stone-400">
          <h3>大运 · {chart.childLimit.forward ? '顺排' : '逆排'}</h3>
          <span className="text-xs">出生后{startOfLuckSpan(chart.childLimit) || '不足一小时'}起运</span>
        </div>
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2">
          {decades.map((d, i) => (
            <button
              key={d.startYear}
              type="button"
              onClick={() => setPicked(i)}
              aria-pressed={i === selected}
              className={`flex w-16 shrink-0 flex-col items-center sm:w-auto sm:flex-1 gap-1 rounded-xl border py-2.5 transition-colors ${
                i === selected
                  ? 'border-stone-800 bg-white shadow-sm dark:border-stone-400 dark:bg-stone-800'
                  : 'border-transparent bg-stone-200/50 hover:bg-white dark:bg-stone-800/50 dark:hover:bg-stone-800'
              }`}
            >
              <span className="text-xs text-stone-500 dark:text-stone-400">{d.startYear}</span>
              <span className="text-xs text-stone-500 dark:text-stone-400">{d.startAge}岁</span>
              <Pillar stem={d.stem} branch={d.branch} />
              {i === currentIndex && <span className="text-[10px] text-red-600 dark:text-red-400">当前</span>}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-sm text-stone-500 dark:text-stone-400">
          流年 · {decade.startYear}–{decade.endYear}
          （{decade.sixtyCycle}运）
        </h3>
        <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
          {decade.years.map((y) => (
            <div
              key={y.year}
              className={`flex flex-col items-center gap-1 rounded-xl py-2.5 ${
                y.year === currentYear ? 'bg-white ring-2 ring-red-500/60 dark:bg-stone-800' : 'bg-stone-200/50 dark:bg-stone-800/50'
              }`}
            >
              <span className="text-xs text-stone-500 dark:text-stone-400">{y.year}</span>
              <span className="text-xs text-stone-500 dark:text-stone-400">{y.age}岁</span>
              <Pillar stem={y.stem} branch={y.branch} />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function startOfLuckSpan({ years, months, days, hours }: Chart['childLimit']) {
  return [
    [years, '年'],
    [months, '个月'],
    [days, '天'],
    [hours, '小时'],
  ]
    .filter(([n]) => n)
    .map(([n, unit]) => `${n}${unit}`)
    .join('')
}

function Pillar({ stem, branch }: { stem: StemView; branch: FortuneBranchView }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-xs text-stone-600 dark:text-stone-400" title={stem.tenStar}>
        {TEN_STAR_SHORT[stem.tenStar]}
      </span>
      <span className={`font-serif text-2xl leading-tight font-semibold ${ELEMENT_TEXT[stem.element]}`}>{stem.name}</span>
      <span className={`font-serif text-2xl leading-tight font-semibold ${ELEMENT_TEXT[branch.element]}`}>{branch.name}</span>
      <span className="text-xs text-stone-600 dark:text-stone-400" title={branch.tenStar}>
        {TEN_STAR_SHORT[branch.tenStar]}
      </span>
    </div>
  )
}
