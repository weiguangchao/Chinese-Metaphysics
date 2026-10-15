import { useEffect, useEffectEvent, useRef, useState, type ReactNode } from 'react'

interface PickerProps {
  labelledBy: string
  display: string | null
  placeholder: string
  icon: ReactNode
  children: ReactNode
  onOpen?: () => void
}

export function Picker({ labelledBy, display, placeholder, icon, children, onOpen }: PickerProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  const dismiss = useEffectEvent((event: PointerEvent | KeyboardEvent) => {
    if (event instanceof KeyboardEvent) {
      if (event.key !== 'Escape') return
      triggerRef.current?.focus()
    } else if (rootRef.current?.contains(event.target as Node)) {
      return
    }
    setOpen(false)
  })

  useEffect(() => {
    if (!open) return
    document.addEventListener('pointerdown', dismiss)
    document.addEventListener('keydown', dismiss)
    return () => {
      document.removeEventListener('pointerdown', dismiss)
      document.removeEventListener('keydown', dismiss)
    }
  }, [open])

  const toggle = () => {
    if (!open) onOpen?.()
    setOpen(!open)
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-labelledby={labelledBy}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={toggle}
        className={`flex h-11 w-full items-center justify-between rounded-lg border bg-white px-3 text-left text-base transition-colors outline-none focus-visible:ring-2 focus-visible:ring-stone-300 ${
          open ? 'border-stone-500 ring-2 ring-stone-300' : 'border-stone-300 hover:border-stone-400'
        }`}
      >
        <span className={display ? 'text-stone-800' : 'text-stone-400'}>{display ?? placeholder}</span>
        <span className="text-stone-400">{icon}</span>
      </button>
      {open && (
        <div
          role="dialog"
          aria-labelledby={labelledBy}
          className="absolute top-full left-0 z-20 mt-2 rounded-2xl bg-white p-3 shadow-xl ring-1 ring-stone-200"
          onClick={(event) => {
            if (!(event.target as HTMLElement).closest('[data-picker-close]')) return
            setOpen(false)
            triggerRef.current?.focus()
          }}
        >
          {children}
        </div>
      )}
    </div>
  )
}

export function CalendarIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-5">
      <rect x="3" y="4.5" width="14" height="12.5" rx="2" />
      <path d="M3 8.5h14M7 3v3M13 3v3" strokeLinecap="round" />
    </svg>
  )
}

export function ClockIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-5">
      <circle cx="10" cy="10" r="7" />
      <path d="M10 6v4l2.5 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function ChevronIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.75" className="size-4">
      <path
        d={direction === 'left' ? 'M12.5 5 7.5 10l5 5' : 'M7.5 5l5 5-5 5'}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
