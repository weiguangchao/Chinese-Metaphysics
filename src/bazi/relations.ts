import { EarthBranch, HeavenStem } from 'tyme4ts'

interface Match {
  label: string
  /** Pillar indices involved. */
  indices: number[]
}

const RESTRAINS: Record<string, string> = { 木: '土', 土: '水', 水: '火', 火: '金', 金: '木' }

// Tables follow the glossary in AGENTS.md. A trailing character is the transformed element.
const FIVE_COMBINATIONS = ['甲己土', '乙庚金', '丙辛水', '丁壬木', '戊癸火']
const SIX_OPPOSITIONS = ['子午', '丑未', '寅申', '卯酉', '辰戌', '巳亥']
const SIX_COMBINATIONS = ['子丑土', '寅亥木', '卯戌火', '辰酉金', '巳申水', '午未土']
const THREE_COMBINATIONS = ['申子辰水', '亥卯未木', '寅午戌火', '巳酉丑金']
const THREE_PUNISHMENTS = [
  { group: '寅巳申', name: '无恩之刑' },
  { group: '丑戌未', name: '恃势之刑' },
]
const SELF_PUNISHING = '辰午酉亥'

function pairs(count: number): [number, number][] {
  const result: [number, number][] = []
  for (let i = 0; i < count; i++) for (let j = i + 1; j < count; j++) result.push([i, j])
  return result
}

/** Each pair whose element restrains the other's, labelled restrainer first. */
function restraints(names: string[], elementOf: (name: string) => string): Match[] {
  return pairs(names.length).flatMap(([i, j]) => {
    if (RESTRAINS[elementOf(names[i])] === elementOf(names[j])) return [{ label: `${names[i]}克${names[j]}`, indices: [i, j] }]
    if (RESTRAINS[elementOf(names[j])] === elementOf(names[i])) return [{ label: `${names[j]}克${names[i]}`, indices: [i, j] }]
    return []
  })
}

/** Each pair matching the first two characters of an entry, in either order. */
function tablePairs(names: string[], table: string[], label: (entry: string) => string): Match[] {
  return pairs(names.length).flatMap(([i, j]) => {
    const entry = table.find((e) => (names[i] === e[0] && names[j] === e[1]) || (names[j] === e[0] && names[i] === e[1]))
    return entry ? [{ label: label(entry), indices: [i, j] }] : []
  })
}

/** Index triples whose branches are exactly the three in `group`. */
function triples(names: string[], group: string): number[][] {
  const result: number[][] = []
  for (let i = 0; i < names.length; i++)
    for (let j = i + 1; j < names.length; j++)
      for (let k = j + 1; k < names.length; k++) {
        const order = [i, j, k].map((n) => group.indexOf(names[n]))
        if ([0, 1, 2].every((g) => order.includes(g))) result.push([i, j, k])
      }
  return result
}

/** Pair matches from a three-branch group, minus pairs that sit inside a complete triple. */
function partialPairs(names: string[], group: string, label: (pair: string) => string, table: string[]): Match[] {
  const found = triples(names, group)
  return tablePairs(names, table, label).filter((m) => !found.some((t) => m.indices.every((i) => t.includes(i))))
}

const labels = (matches: Match[]) => [...new Set(matches.map((m) => m.label))]

/** 天干留意: restraints, then five combinations. */
export function stemRelations(names: string[]): string[] {
  return labels([
    ...restraints(names, (n) => HeavenStem.fromName(n).getElement().getName()),
    ...tablePairs(names, FIVE_COMBINATIONS, (e) => `${e[0]}${e[1]}合化${e[2]}`),
  ])
}

/**
 * 地支留意: restraints, clashes, six combinations, three combinations, half three combinations, punishments.
 * A restraint is dropped when its two branches already clash, combine, or punish each other.
 */
export function branchRelations(names: string[]): string[] {
  const threeCombinations = THREE_COMBINATIONS.flatMap((entry) => {
    const group = entry.slice(0, 3)
    return triples(names, group).map((indices) => ({ label: `${group}合${entry[3]}局`, indices }))
  })
  const halfThreeCombinations = THREE_COMBINATIONS.flatMap((entry) => {
    const group = entry.slice(0, 3)
    return partialPairs(names, group, (e) => `${e}半合${entry[3]}局`, [group.slice(0, 2), group.slice(1, 3)])
  })
  const punishments = [
    ...THREE_PUNISHMENTS.flatMap(({ group, name }) => [
      ...triples(names, group).map((indices) => ({ label: `${group}${name}`, indices })),
      ...partialPairs(names, group, (e) => `${e}相刑`, [group.slice(0, 2), group.slice(1, 3), group[0] + group[2]]),
    ]),
    ...tablePairs(names, ['子卯'], () => '子卯无礼之刑'),
    ...pairs(names.length)
      .filter(([i, j]) => names[i] === names[j] && SELF_PUNISHING.includes(names[i]))
      .map(([i, j]) => ({ label: `${names[i]}${names[j]}自刑`, indices: [i, j] })),
  ]

  const others = [
    ...tablePairs(names, SIX_OPPOSITIONS, (e) => `${e}冲`),
    ...tablePairs(names, SIX_COMBINATIONS, (e) => `${e[0]}${e[1]}合化${e[2]}`),
    ...threeCombinations,
    ...halfThreeCombinations,
    ...punishments,
  ]
  const restraintsLeft = restraints(names, (n) => EarthBranch.fromName(n).getElement().getName()).filter(
    (r) => !others.some((o) => r.indices.every((i) => o.indices.includes(i))),
  )
  return labels([...restraintsLeft, ...others])
}
