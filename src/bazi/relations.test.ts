import { describe, expect, it } from 'vitest'
import { branchRelations, stemRelations } from './relations'

describe('stemRelations', () => {
  it('lists each restraint once, restrainer first', () => {
    expect(stemRelations(['丁', '辛', '乙', '辛'])).toEqual(['丁克辛', '辛克乙'])
  })

  it('lists restraints before five combinations', () => {
    expect(stemRelations(['甲', '己', '乙', '庚'])).toEqual([
      '甲克己',
      '庚克甲',
      '乙克己',
      '庚克乙',
      '甲己合化土',
      '乙庚合化金',
    ])
  })
})

describe('branchRelations', () => {
  it('keeps a plain restraint but drops one whose pair already clashes', () => {
    expect(branchRelations(['丑', '亥', '丑', '巳'])).toEqual(['丑克亥', '巳亥冲'])
  })

  it('reports a complete three combination without the half combinations inside it', () => {
    expect(branchRelations(['申', '子', '辰', '子'])).toEqual(['申子辰合水局'])
  })

  it('reports a half combination when the third branch is missing', () => {
    expect(branchRelations(['寅', '午', '卯', '酉'])).toEqual(['酉克寅', '午克酉', '卯酉冲', '寅午半合火局'])
  })

  it('reports the full 寅巳申 punishment instead of its pairs', () => {
    expect(branchRelations(['寅', '巳', '申', '亥'])).toEqual([
      '寅申冲',
      '巳亥冲',
      '寅亥合化木',
      '巳申合化水',
      '寅巳申无恩之刑',
    ])
  })

  it('reports partial and self punishments', () => {
    expect(branchRelations(['丑', '戌', '午', '午'])).toEqual(['午戌半合火局', '丑戌相刑', '午午自刑'])
  })
})
