import type { BirthInput, Gender } from './bazi/chart'

export interface BirthForm {
  /** YYYY-MM-DD */
  date: string
  /** HH:MM */
  time: string
  gender: Gender
  lateZiSameDay: boolean
}

export const MIN_YEAR = 1900
export const MAX_YEAR = 2100

const DEFAULT_FORM: BirthForm = {
  date: '1990-05-20',
  time: '08:30',
  gender: 'male',
  lateZiSameDay: false,
}

export function toBirthInput(form: BirthForm): BirthInput | null {
  const date = /^(\d{4})-(\d{2})-(\d{2})$/.exec(form.date)
  const time = /^(\d{2}):(\d{2})/.exec(form.time)
  if (!date || !time) return null
  const [year, month, day, hour, minute] = [date[1], date[2], date[3], time[1], time[2]].map(Number)
  if (year < MIN_YEAR || year > MAX_YEAR) return null
  const check = new Date(Date.UTC(year, month - 1, day))
  if (check.getUTCMonth() !== month - 1 || hour > 23 || minute > 59) return null
  const { gender, lateZiSameDay } = form
  return { year, month, day, hour, minute, gender, lateZiSameDay }
}

export function readFormFromUrl(search: string): BirthForm {
  const params = new URLSearchParams(search)
  return {
    date: params.get('date') ?? DEFAULT_FORM.date,
    time: params.get('time') ?? DEFAULT_FORM.time,
    gender: params.get('gender') === 'female' ? 'female' : DEFAULT_FORM.gender,
    lateZiSameDay: params.get('zi') === 'late',
  }
}

export function formToSearch(form: BirthForm): string {
  const params = new URLSearchParams({ date: form.date, time: form.time, gender: form.gender })
  if (form.lateZiSameDay) params.set('zi', 'late')
  return `?${params}`
}
