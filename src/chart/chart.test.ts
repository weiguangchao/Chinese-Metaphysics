import { describe, expect, it } from 'vitest'
import { castChart, type BirthInput } from './chart'

const birth = (overrides: Partial<BirthInput>): BirthInput => ({
  year: 1990,
  month: 5,
  day: 20,
  hour: 8,
  minute: 30,
  gender: 'male',
  lateZiSameDay: false,
  ...overrides,
})

const pillarNames = (input: BirthInput) => castChart(input).pillars.map((p) => p.stem.name + p.branch.name)

describe('castChart', () => {
  it('casts the pillars and reads every stem against the DayMaster', () => {
    const chart = castChart(birth({}))

    expect(chart.pillars.map((p) => p.stem.name + p.branch.name)).toEqual(['庚午', '辛巳', '乙酉', '庚辰'])
    expect(chart.pillars.map((p) => p.stem.tenStar)).toEqual(['正官', '七杀', '比肩', '正官'])
    expect(chart.pillars.map((p) => p.hiddenStems.map((h) => `${h.name}${h.type}${h.tenStar}`))).toEqual([
      ['丁本气食神', '己中气偏财'],
      ['丙本气伤官', '戊中气正财', '庚余气正官'],
      ['辛本气七杀'],
      ['戊本气正财', '乙中气比肩', '癸余气偏印'],
    ])
  })

  it.each([
    ['2024-02-04 16:26', 16, 26, ['癸卯', '乙丑']],
    ['2024-02-04 16:28', 16, 28, ['甲辰', '丙寅']],
  ])('changes year and month pillars at the exact 立春 moment (%s)', (_, hour, minute, expected) => {
    expect(pillarNames(birth({ year: 2024, month: 2, day: 4, hour, minute })).slice(0, 2)).toEqual(expected)
  })

  it('starts the next day at 23:00 unless 晚子时 keeps the current day', () => {
    const lateZi = { year: 2000, month: 1, day: 1, hour: 23, minute: 30 }
    expect(pillarNames(birth(lateZi))).toEqual(['己卯', '丙子', '己未', '甲子'])
    expect(pillarNames(birth({ ...lateZi, lateZiSameDay: true }))).toEqual(['己卯', '丙子', '戊午', '甲子'])
  })

  it('runs decade fortunes forward for a yang-year male and backward for a yang-year female', () => {
    const male = castChart(birth({ gender: 'male' }))
    const female = castChart(birth({ gender: 'female' }))

    expect(male.childLimit.forward).toBe(true)
    expect(male.decades).toHaveLength(11)
    expect(male.decades.slice(0, 3).map((d) => d.sixtyCycle)).toEqual(['壬午', '癸未', '甲申'])
    expect(female.childLimit.forward).toBe(false)
    expect(female.decades[0].sixtyCycle).toBe('庚辰')
  })

  it('starts luck about 5 years after birth when the next 节 is 17 days away, and lists annual pillars by age', () => {
    const chart = castChart(birth({}))
    const [first] = chart.decades

    expect(chart.childLimit.years).toBe(5)
    expect([first.startYear, first.startAge, first.stem.tenStar, first.branch.tenStar]).toEqual([1996, 7, '正印', '食神'])

    const year2026 = chart.decades.flatMap((d) => d.years).find((y) => y.year === 2026)
    expect([year2026?.sixtyCycle, year2026?.age, year2026?.stem.tenStar]).toEqual(['丙午', 37, '伤官'])
  })
})
