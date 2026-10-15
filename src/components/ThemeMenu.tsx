import { useRef, useState, type ComponentType } from 'react'
import { useThemePreference, type ThemePreference } from '../theme'
import { useDismiss } from './useDismiss'

const OPTIONS: { value: ThemePreference; label: string; Icon: ComponentType }[] = [
  { value: 'system', label: '跟随系统', Icon: MonitorIcon },
  { value: 'light', label: '浅色', Icon: SunIcon },
  { value: 'dark', label: '深色', Icon: MoonIcon },
]

export function ThemeMenu() {
  const [preference, setPreference] = useThemePreference()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  useDismiss(open, rootRef, triggerRef, () => setOpen(false))
  const current = OPTIONS.find((option) => option.value === preference) ?? OPTIONS[0]

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-label={`外观：${current.label}`}
        title={`外观：${current.label}`}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className={`flex size-10 items-center justify-center rounded-xl text-stone-500 ring-1 transition-colors outline-none hover:text-stone-800 focus-visible:ring-2 focus-visible:ring-stone-300 dark:text-stone-400 dark:hover:text-stone-100 dark:focus-visible:ring-stone-600 ${
          open
            ? 'bg-white text-stone-800 ring-stone-300 dark:bg-stone-800 dark:text-stone-100 dark:ring-stone-600'
            : 'bg-white/70 ring-stone-200 hover:bg-white dark:bg-stone-900/70 dark:ring-stone-800 dark:hover:bg-stone-800'
        }`}
      >
        <current.Icon />
      </button>
      {open && (
        <div
          role="group"
          aria-label="外观"
          className="absolute top-full right-0 z-20 mt-2 flex w-36 flex-col gap-0.5 rounded-xl bg-white p-1 shadow-xl ring-1 ring-stone-200 dark:bg-stone-900 dark:shadow-black/40 dark:ring-stone-700"
        >
          {OPTIONS.map(({ value, label, Icon }) => (
            <button
              key={value}
              type="button"
              aria-pressed={value === preference}
              onClick={() => {
                setPreference(value)
                setOpen(false)
                triggerRef.current?.focus()
              }}
              className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors ${
                value === preference
                  ? 'bg-stone-100 text-stone-900 dark:bg-stone-800 dark:text-stone-100'
                  : 'text-stone-600 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800'
              }`}
            >
              <Icon />
              <span className="flex-1 text-left">{label}</span>
              {value === preference && <CheckIcon />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function MonitorIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-5">
      <rect x="2.5" y="3.5" width="15" height="10.5" rx="1.75" />
      <path d="M7 17h6M10 14v3" strokeLinecap="round" />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-5">
      <circle cx="10" cy="10" r="3.25" />
      <path
        d="M10 2.5v1.75M10 15.75v1.75M2.5 10h1.75M15.75 10h1.75M4.7 4.7l1.24 1.24M14.06 14.06l1.24 1.24M4.7 15.3l1.24-1.24M14.06 5.94l1.24-1.24"
        strokeLinecap="round"
      />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-5">
      <path d="M16.5 12.2A6.75 6.75 0 0 1 7.8 3.5a6.75 6.75 0 1 0 8.7 8.7Z" strokeLinejoin="round" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.75" className="size-4">
      <path d="m5 10.5 3.25 3.25L15 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
