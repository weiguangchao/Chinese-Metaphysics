import { useId, type ReactNode } from 'react'
import type { BirthForm } from '../birthForm'
import { DatePicker } from './DatePicker'
import { TimePicker } from './TimePicker'

interface Props {
  form: BirthForm
  onChange: (form: BirthForm) => void
}

export function BirthFormPanel({ form, onChange }: Props) {
  const set = <K extends keyof BirthForm>(key: K, value: BirthForm[K]) => onChange({ ...form, [key]: value })
  const id = useId()

  return (
    <form className="grid gap-5 sm:grid-cols-[1fr_1fr_auto]" onSubmit={(e) => e.preventDefault()}>
      <Field id={`${id}-date`} label="出生日期（公历）">
        <DatePicker labelledBy={`${id}-date`} value={form.date} onChange={(date) => set('date', date)} />
      </Field>
      <Field id={`${id}-time`} label="出生时间（北京时间）">
        <TimePicker labelledBy={`${id}-time`} value={form.time} onChange={(time) => set('time', time)} />
      </Field>
      <div role="group" aria-labelledby="gender-label" className="flex flex-col gap-1.5">
        <span id="gender-label" className="text-sm text-stone-500 dark:text-stone-400">
          性别
        </span>
        <div className="flex h-11 rounded-lg border border-stone-300 bg-white p-1 dark:border-stone-700 dark:bg-stone-900">
          {(['male', 'female'] as const).map((gender) => (
            <button
              key={gender}
              type="button"
              aria-pressed={form.gender === gender}
              onClick={() => set('gender', gender)}
              className={`w-16 rounded-md text-sm transition-colors ${
                form.gender === gender
                  ? 'bg-stone-800 text-stone-50 dark:bg-stone-200 dark:text-stone-900'
                  : 'text-stone-600 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800'
              }`}
            >
              {gender === 'male' ? '男' : '女'}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2 text-sm text-stone-600 sm:col-span-3 sm:flex-row sm:gap-8 dark:text-stone-400">
        <Toggle checked={form.lateZiSameDay} onChange={(v) => set('lateZiSameDay', v)}>
          晚子时（23:00–24:00）不换日
        </Toggle>
      </div>
    </form>
  )
}

function Field({ id, label, children }: { id: string; label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span id={id} className="text-sm text-stone-500 dark:text-stone-400">
        {label}
      </span>
      {children}
    </div>
  )
}

function Toggle({ checked, onChange, children }: { checked: boolean; onChange: (v: boolean) => void; children: ReactNode }) {
  return (
    <label className="flex cursor-pointer items-center gap-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="size-4 accent-stone-800 dark:accent-stone-300"
      />
      {children}
    </label>
  )
}
