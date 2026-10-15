import type { Element } from '../chart/chart'

export const ELEMENT_TEXT: Record<Element, string> = {
  木: 'text-emerald-700 dark:text-emerald-400',
  火: 'text-red-600 dark:text-red-400',
  土: 'text-amber-800 dark:text-amber-600',
  金: 'text-yellow-600 dark:text-yellow-400',
  水: 'text-sky-700 dark:text-sky-400',
}

export const ELEMENT_EMOJI: Record<Element, string> = {
  木: '🪵',
  火: '🔥',
  土: '⛰️',
  金: '🪙',
  水: '💧',
}
