import { useLayoutEffect, useRef } from 'react'
import { ClockIcon, Picker } from './Picker'

interface Props {
  labelledBy: string
  value: string
  onChange: (value: string) => void
}

const BRANCHES = '子丑寅卯辰巳午未申酉戌亥'
const HOURS = Array.from({ length: 24 }, (_, i) => i)
const MINUTES = Array.from({ length: 60 }, (_, i) => i)

const pad = (n: number) => String(n).padStart(2, '0')
const shichen = (hour: number) => `${BRANCHES[Math.floor((hour + 1) / 2) % 12]}时`

function parse(value: string): { hour: number; minute: number } | null {
  const match = /^(\d{2}):(\d{2})/.exec(value)
  return match ? { hour: Number(match[1]), minute: Number(match[2]) } : null
}

export function TimePicker({ labelledBy, value, onChange }: Props) {
  const selected = parse(value)

  return (
    <Picker
      labelledBy={labelledBy}
      display={selected && `${pad(selected.hour)}:${pad(selected.minute)} · ${shichen(selected.hour)}`}
      placeholder="选择时间"
      icon={<ClockIcon />}
    >
      <div className="flex gap-2">
        <Column
          title="时"
          options={HOURS}
          selected={selected?.hour}
          onPick={(hour) => onChange(`${pad(hour)}:${pad(selected?.minute ?? 0)}`)}
        />
        <Column
          title="分"
          options={MINUTES}
          selected={selected?.minute}
          onPick={(minute) => onChange(`${pad(selected?.hour ?? 0)}:${pad(minute)}`)}
          closesOnPick
        />
      </div>
    </Picker>
  )
}

interface ColumnProps {
  title: string
  options: number[]
  selected: number | undefined
  onPick: (value: number) => void
  closesOnPick?: boolean
}

function Column({ title, options, selected, onPick, closesOnPick }: ColumnProps) {
  const listRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const list = listRef.current
    const option = list?.querySelector<HTMLElement>('[aria-selected="true"]')
    if (list && option) list.scrollTop = option.offsetTop - (list.clientHeight - option.offsetHeight) / 2
  }, [])

  return (
    <div className="flex flex-col">
      <div className="pb-1.5 text-center text-xs text-stone-400 dark:text-stone-500">{title}</div>
      <div
        ref={listRef}
        role="listbox"
        aria-label={title}
        className="relative h-64 w-20 overflow-y-auto overscroll-contain [scrollbar-width:thin]"
      >
        {options.map((value) => {
          const isSelected = value === selected
          return (
            <button
              key={value}
              type="button"
              role="option"
              aria-selected={isSelected}
              data-picker-close={closesOnPick || undefined}
              onClick={() => onPick(value)}
              className={`flex h-9 w-full items-center justify-center rounded-lg text-sm tabular-nums transition-colors ${
                isSelected
                  ? 'bg-stone-800 text-white dark:bg-stone-200 dark:text-stone-900'
                  : 'text-stone-700 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800'
              }`}
            >
              {pad(value)}
            </button>
          )
        })}
      </div>
    </div>
  )
}
