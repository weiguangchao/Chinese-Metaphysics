import { useMemo, useState, type ReactNode } from 'react'
import { SolarDay } from 'tyme4ts'
import { MAX_YEAR, MIN_YEAR } from '../birthForm'
import { CalendarIcon, ChevronIcon, Picker } from './Picker'

interface Props {
  labelledBy: string
  value: string
  onChange: (value: string) => void
}

interface Ymd {
  year: number
  month: number
  day: number
}

type View = 'day' | 'month' | 'year'

const WEEKDAYS = ['一', '二', '三', '四', '五', '六', '日']
const YEAR_PAGE = 12
const DAY_MS = 86400_000

const pad = (n: number) => String(n).padStart(2, '0')
const toValue = ({ year, month, day }: Ymd) => `${year}-${pad(month)}-${pad(day)}`
const sameDay = (a: Ymd | null, b: Ymd) => !!a && a.year === b.year && a.month === b.month && a.day === b.day
const inRange = (year: number) => year >= MIN_YEAR && year <= MAX_YEAR

function parse(value: string): Ymd | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  return match ? { year: Number(match[1]), month: Number(match[2]), day: Number(match[3]) } : null
}

function today(): Ymd {
  const now = new Date()
  return { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() }
}

function monthCells(year: number, month: number): Ymd[] {
  const lead = (new Date(Date.UTC(year, month - 1, 1)).getUTCDay() + 6) % 7
  const start = Date.UTC(year, month - 1, 1 - lead)
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start + i * DAY_MS)
    return { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate() }
  })
}

function lunarLabel({ year, month, day }: Ymd): { text: string; jie: boolean } {
  const solarDay = SolarDay.fromYmd(year, month, day)
  const termDay = solarDay.getTermDay()
  if (termDay.getDayIndex() === 0) return { text: termDay.getName(), jie: termDay.getSolarTerm().isJie() }
  const lunarDay = solarDay.getLunarDay()
  return { text: lunarDay.getDay() === 1 ? lunarDay.getLunarMonth().getName() : lunarDay.getName(), jie: false }
}

export function DatePicker({ labelledBy, value, onChange }: Props) {
  const selected = parse(value)
  const [view, setView] = useState<View>('day')
  const [cursor, setCursor] = useState(() => selected ?? today())

  return (
    <Picker
      labelledBy={labelledBy}
      display={selected && `${selected.year}年${selected.month}月${selected.day}日`}
      placeholder="选择日期"
      icon={<CalendarIcon />}
      onOpen={() => {
        setView('day')
        setCursor(selected ?? today())
      }}
    >
      <div className="w-76">
        {view === 'day' && (
          <DayView
            cursor={cursor}
            selected={selected}
            setCursor={setCursor}
            setView={setView}
            pick={(ymd) => onChange(toValue(ymd))}
          />
        )}
        {view === 'month' && <MonthView cursor={cursor} setCursor={setCursor} setView={setView} />}
        {view === 'year' && <YearView cursor={cursor} setCursor={setCursor} setView={setView} />}
      </div>
    </Picker>
  )
}

interface ViewProps {
  cursor: Ymd
  setCursor: (cursor: Ymd) => void
  setView: (view: View) => void
}

function DayView({ cursor, selected, setCursor, setView, pick }: ViewProps & { selected: Ymd | null; pick: (ymd: Ymd) => void }) {
  const cells = useMemo(
    () => monthCells(cursor.year, cursor.month).map((ymd) => ({ ymd, label: lunarLabel(ymd) })),
    [cursor.year, cursor.month],
  )
  const now = today()
  const shift = (delta: number) => {
    const index = cursor.year * 12 + cursor.month - 1 + delta
    const year = Math.floor(index / 12)
    if (inRange(year)) setCursor({ year, month: (index % 12) + 1, day: 1 })
  }

  return (
    <>
      <Header
        onPrev={() => shift(-1)}
        onNext={() => shift(1)}
        prevDisabled={cursor.year === MIN_YEAR && cursor.month === 1}
        nextDisabled={cursor.year === MAX_YEAR && cursor.month === 12}
      >
        <HeaderButton onClick={() => setView('year')}>{cursor.year}年</HeaderButton>
        <HeaderButton onClick={() => setView('month')}>{cursor.month}月</HeaderButton>
      </Header>
      <div className="grid grid-cols-7 text-center text-xs text-stone-400">
        {WEEKDAYS.map((w) => (
          <div key={w} className="py-1.5">
            {w}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-0.5">
        {cells.map(({ ymd, label }) => {
          const isSelected = sameDay(selected, ymd)
          const outside = ymd.month !== cursor.month
          return (
            <button
              key={toValue(ymd)}
              type="button"
              disabled={!inRange(ymd.year)}
              data-picker-close
              aria-pressed={isSelected}
              aria-label={`${ymd.year}年${ymd.month}月${ymd.day}日 ${label.text}`}
              onClick={() => pick(ymd)}
              className={`flex h-11 flex-col items-center justify-center rounded-lg leading-tight transition-colors disabled:invisible ${
                isSelected
                  ? 'bg-stone-800 text-white'
                  : `hover:bg-stone-100 ${outside ? 'text-stone-300' : 'text-stone-800'} ${
                      sameDay(now, ymd) ? 'ring-1 ring-stone-300 ring-inset' : ''
                    }`
              }`}
            >
              <span className="text-sm">{ymd.day}</span>
              <span
                className={`text-[10px] ${
                  isSelected ? 'text-stone-300' : label.jie && !outside ? 'text-red-600' : outside ? '' : 'text-stone-400'
                }`}
              >
                {label.text}
              </span>
            </button>
          )
        })}
      </div>
      <div className="mt-2 flex items-center justify-end border-t border-stone-100 pt-2.5 text-xs">
        <button
          type="button"
          data-picker-close
          onClick={() => pick(now)}
          className="rounded-md px-2 py-1 text-stone-700 transition-colors hover:bg-stone-100"
        >
          今天
        </button>
      </div>
    </>
  )
}

function MonthView({ cursor, setCursor, setView }: ViewProps) {
  return (
    <>
      <Header
        onPrev={() => setCursor({ ...cursor, year: cursor.year - 1 })}
        onNext={() => setCursor({ ...cursor, year: cursor.year + 1 })}
        prevDisabled={cursor.year <= MIN_YEAR}
        nextDisabled={cursor.year >= MAX_YEAR}
      >
        <HeaderButton onClick={() => setView('year')}>{cursor.year}年</HeaderButton>
      </Header>
      <Grid>
        {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
          <GridButton
            key={month}
            active={month === cursor.month}
            onClick={() => {
              setCursor({ ...cursor, month })
              setView('day')
            }}
          >
            {month}月
          </GridButton>
        ))}
      </Grid>
    </>
  )
}

function YearView({ cursor, setCursor, setView }: ViewProps) {
  const [start, setStart] = useState(() => cursor.year - ((cursor.year - MIN_YEAR) % YEAR_PAGE))
  const years = Array.from({ length: YEAR_PAGE }, (_, i) => start + i)
  return (
    <>
      <Header
        onPrev={() => setStart(start - YEAR_PAGE)}
        onNext={() => setStart(start + YEAR_PAGE)}
        prevDisabled={start <= MIN_YEAR}
        nextDisabled={start + YEAR_PAGE > MAX_YEAR}
      >
        <span className="px-2 text-sm font-medium text-stone-800">
          {start}–{Math.min(start + YEAR_PAGE - 1, MAX_YEAR)}
        </span>
      </Header>
      <Grid>
        {years.map((year) => (
          <GridButton
            key={year}
            active={year === cursor.year}
            disabled={!inRange(year)}
            onClick={() => {
              setCursor({ ...cursor, year })
              setView('month')
            }}
          >
            {year}
          </GridButton>
        ))}
      </Grid>
    </>
  )
}

function Header({
  children,
  onPrev,
  onNext,
  prevDisabled,
  nextDisabled,
}: {
  children: ReactNode
  onPrev: () => void
  onNext: () => void
  prevDisabled: boolean
  nextDisabled: boolean
}) {
  return (
    <div className="mb-1 flex items-center justify-between">
      <NavButton label="上一页" disabled={prevDisabled} onClick={onPrev}>
        <ChevronIcon direction="left" />
      </NavButton>
      <div className="flex items-center gap-0.5">{children}</div>
      <NavButton label="下一页" disabled={nextDisabled} onClick={onNext}>
        <ChevronIcon direction="right" />
      </NavButton>
    </div>
  )
}

function NavButton({ label, disabled, onClick, children }: { label: string; disabled: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex size-8 items-center justify-center rounded-lg text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-800 disabled:pointer-events-none disabled:opacity-30"
    >
      {children}
    </button>
  )
}

function HeaderButton({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-lg px-2 py-1 text-sm font-medium text-stone-800 transition-colors hover:bg-stone-100"
    >
      {children}
    </button>
  )
}

function Grid({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-3 gap-1.5 pt-1">{children}</div>
}

function GridButton({
  active,
  disabled,
  onClick,
  children,
}: {
  active: boolean
  disabled?: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={`h-12 rounded-lg text-sm transition-colors disabled:invisible ${
        active ? 'bg-stone-800 text-white' : 'text-stone-700 hover:bg-stone-100'
      }`}
    >
      {children}
    </button>
  )
}
