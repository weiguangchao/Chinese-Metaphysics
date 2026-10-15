import { useEffect, useEffectEvent, type RefObject } from 'react'

export function useDismiss(
  open: boolean,
  rootRef: RefObject<HTMLElement | null>,
  triggerRef: RefObject<HTMLElement | null>,
  close: () => void,
) {
  const dismiss = useEffectEvent((event: PointerEvent | KeyboardEvent) => {
    if (event instanceof KeyboardEvent) {
      if (event.key !== 'Escape') return
      triggerRef.current?.focus()
    } else if (rootRef.current?.contains(event.target as Node)) {
      return
    }
    close()
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
}
