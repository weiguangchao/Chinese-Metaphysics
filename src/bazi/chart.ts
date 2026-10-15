import {
  ChildLimit,
  DefaultEightCharProvider,
  Gender as TymeGender,
  HeavenStem,
  LunarHour,
  LunarSect2EightCharProvider,
  SixtyCycleYear,
  SolarTime,
  type EarthBranch,
  type SixtyCycle,
} from 'tyme4ts'
import { branchRelations, stemRelations } from './relations'

export interface WallTime {
  year: number
  month: number
  day: number
  hour: number
  minute: number
}

export type Gender = 'male' | 'female'
export type Element = '木' | '火' | '土' | '金' | '水'

export interface BirthInput extends WallTime {
  gender: Gender
  /** 晚子时 (23:00–24:00) keeps the current day pillar instead of starting the next day. */
  lateZiSameDay: boolean
}

export interface StemView {
  name: string
  element: Element
  yinYang: '阴' | '阳'
  tenStar: string
}

export interface BranchView {
  name: string
  element: Element
  yinYang: '阴' | '阳'
}

export interface HiddenStemView extends StemView {
  type: '本气' | '中气' | '余气'
}

export interface PillarView {
  label: '年柱' | '月柱' | '日柱' | '时柱'
  stem: StemView
  branch: BranchView
  hiddenStems: HiddenStemView[]
  /** 星运: the DayMaster's twelve-stage state on this branch. */
  terrain: string
  /** 自坐: the pillar's own stem's twelve-stage state on its branch. */
  selfTerrain: string
}

/** A fortune branch carries the TenStar of its main-qi hidden stem. */
export interface FortuneBranchView extends BranchView {
  tenStar: string
}

export interface AnnualFortuneView {
  year: number
  age: number
  sixtyCycle: string
  stem: StemView
  branch: FortuneBranchView
}

export interface DecadeFortuneView {
  sixtyCycle: string
  stem: StemView
  branch: FortuneBranchView
  startAge: number
  endAge: number
  startYear: number
  endYear: number
  years: AnnualFortuneView[]
}

export interface Chart {
  /** The Beijing time the chart is cast for. */
  solarTime: WallTime
  lunarDate: string
  zodiac: string
  gender: Gender
  pillars: PillarView[]
  /** 天干留意 */
  stemRelations: string[]
  /** 地支留意 */
  branchRelations: string[]
  childLimit: {
    forward: boolean
    years: number
    months: number
    days: number
    hours: number
  }
  decades: DecadeFortuneView[]
}

const DECADE_COUNT = 11

// Ordered 本气, 中气, 余气 as in AGENTS.md. tyme4ts orders 巳 as 丙庚戊, so the table lives here.
const HIDDEN_STEMS: Record<string, string> = {
  子: '癸',
  丑: '己癸辛',
  寅: '甲丙戊',
  卯: '乙',
  辰: '戊乙癸',
  巳: '丙戊庚',
  午: '丁己',
  未: '己丁乙',
  申: '庚壬戊',
  酉: '辛',
  戌: '戊辛丁',
  亥: '壬甲',
}
const HIDDEN_TYPES = ['本气', '中气', '余气'] as const

const hiddenStemsOf = (branch: EarthBranch) => [...HIDDEN_STEMS[branch.getName()]].map((n) => HeavenStem.fromName(n))

const yinYangOf = (x: HeavenStem | EarthBranch) => (x.getYinYang() === 1 ? '阳' : '阴')

function stemView(stem: HeavenStem, dayMaster: HeavenStem): StemView {
  return {
    name: stem.getName(),
    element: stem.getElement().getName() as Element,
    yinYang: yinYangOf(stem),
    tenStar: dayMaster.getTenStar(stem).getName(),
  }
}

function branchView(branch: EarthBranch): BranchView {
  return {
    name: branch.getName(),
    element: branch.getElement().getName() as Element,
    yinYang: yinYangOf(branch),
  }
}

function fortuneBranchView(branch: EarthBranch, dayMaster: HeavenStem): FortuneBranchView {
  return { ...branchView(branch), tenStar: dayMaster.getTenStar(hiddenStemsOf(branch)[0]).getName() }
}

function pillarView(label: PillarView['label'], cycle: SixtyCycle, dayMaster: HeavenStem): PillarView {
  const stem = cycle.getHeavenStem()
  const branch = cycle.getEarthBranch()
  return {
    label,
    stem: stemView(stem, dayMaster),
    branch: branchView(branch),
    hiddenStems: hiddenStemsOf(branch).map((hidden, i) => ({
      ...stemView(hidden, dayMaster),
      type: HIDDEN_TYPES[i],
    })),
    terrain: dayMaster.getTerrain(branch).getName(),
    selfTerrain: stem.getTerrain(branch).getName(),
  }
}

function annualFortunes(startYear: number, endYear: number, birthYear: number, dayMaster: HeavenStem) {
  const years: AnnualFortuneView[] = []
  for (let year = startYear; year <= endYear; year++) {
    const cycle = SixtyCycleYear.fromYear(year).getSixtyCycle()
    years.push({
      year,
      age: year - birthYear + 1,
      sixtyCycle: cycle.getName(),
      stem: stemView(cycle.getHeavenStem(), dayMaster),
      branch: fortuneBranchView(cycle.getEarthBranch(), dayMaster),
    })
  }
  return years
}

export function castChart(input: BirthInput): Chart {
  const { year, month, day, hour, minute } = input
  const solarTime = SolarTime.fromYmdHms(year, month, day, hour, minute, 0)

  // tyme4ts reads the 子时 convention from a global provider, so set it on every call.
  LunarHour.provider = input.lateZiSameDay ? new LunarSect2EightCharProvider() : new DefaultEightCharProvider()

  const childLimit = ChildLimit.fromSolarTime(
    solarTime,
    input.gender === 'male' ? TymeGender.MAN : TymeGender.WOMAN,
  )
  const eightChar = childLimit.getEightChar()
  const dayMaster = eightChar.getDay().getHeavenStem()

  const pillars = [
    pillarView('年柱', eightChar.getYear(), dayMaster),
    pillarView('月柱', eightChar.getMonth(), dayMaster),
    pillarView('日柱', eightChar.getDay(), dayMaster),
    pillarView('时柱', eightChar.getHour(), dayMaster),
  ]

  const decades: DecadeFortuneView[] = []
  let decade = childLimit.getStartDecadeFortune()
  for (let i = 0; i < DECADE_COUNT; i++, decade = decade.next(1)) {
    const cycle = decade.getSixtyCycle()
    const startYear = decade.getStartSixtyCycleYear().getYear()
    const endYear = decade.getEndSixtyCycleYear().getYear()
    decades.push({
      sixtyCycle: cycle.getName(),
      stem: stemView(cycle.getHeavenStem(), dayMaster),
      branch: fortuneBranchView(cycle.getEarthBranch(), dayMaster),
      startAge: decade.getStartAge(),
      endAge: decade.getEndAge(),
      startYear,
      endYear,
      years: annualFortunes(startYear, endYear, year, dayMaster),
    })
  }

  return {
    solarTime: { year, month, day, hour, minute },
    lunarDate: solarTime.getLunarHour().getLunarDay().toString(),
    zodiac: eightChar.getYear().getEarthBranch().getZodiac().getName(),
    gender: input.gender,
    pillars,
    stemRelations: stemRelations(pillars.map((p) => p.stem.name)),
    branchRelations: branchRelations(pillars.map((p) => p.branch.name)),
    childLimit: {
      forward: childLimit.isForward(),
      years: childLimit.getYearCount(),
      months: childLimit.getMonthCount(),
      days: childLimit.getDayCount(),
      hours: childLimit.getHourCount(),
    },
    decades,
  }
}
