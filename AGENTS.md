# Chinese Metaphysics

This project studies traditional Chinese metaphysics (命理)

## Glossary

### Ziping method (子平术)

- **EightChar** Eight characters that record a birth time (八字, 四柱八字). The year, month, day, and hour each supply one heavenly stem and one earthly branch.
- **HeavenStem** One of the ten heavenly stems (天干). The values are 甲, 乙, 丙, 丁, 戊, 己, 庚, 辛, 壬, 癸. Each stem has an Element and a YinYang: 甲阳木, 乙阴木, 丙阳火, 丁阴火, 戊阳土, 己阴土, 庚阳金, 辛阴金, 壬阳水, 癸阴水.
- **EarthBranch** One of the twelve earthly branches (地支). The values are 子, 丑, 寅, 卯, 辰, 巳, 午, 未, 申, 酉, 戌, 亥. Each branch has an Element and a YinYang: 子阳水, 丑阴土, 寅阳木, 卯阴木, 辰阳土, 巳阴火, 午阳火, 未阴土, 申阳金, 酉阴金, 戌阳土, 亥阴水.
- **SixtyCycle** One of the sixty stem-branch pairs (干支, 六十甲子). The values are 甲子, 乙丑, 丙寅, 丁卯, 戊辰, 己巳, 庚午, 辛未, 壬申, 癸酉, 甲戌, 乙亥, 丙子, 丁丑, 戊寅, 己卯, 庚辰, 辛巳, 壬午, 癸未, 甲申, 乙酉, 丙戌, 丁亥, 戊子, 己丑, 庚寅, 辛卯, 壬辰, 癸巳, 甲午, 乙未, 丙申, 丁酉, 戊戌, 己亥, 庚子, 辛丑, 壬寅, 癸卯, 甲辰, 乙巳, 丙午, 丁未, 戊申, 己酉, 庚戌, 辛亥, 壬子, 癸丑, 甲寅, 乙卯, 丙辰, 丁巳, 戊午, 己未, 庚申, 辛酉, 壬戌, 癸亥.
- **Element** One of the five elements (五行). The values are 木, 火, 土, 金, 水.
- **ElementGeneration** One Element generates the next (五行相生). The pairs are 木生火, 火生土, 土生金, 金生水, 水生木.
- **ElementRestraint** One Element restrains another (五行相克). The pairs are 木克土, 土克水, 水克火, 火克金, 金克木.
- **YinYang** One of yin and yang (阴阳). The values are 阴, 阳.
- **SolarTerm** One of the twenty-four solar terms (节气). The values are 立春, 雨水, 惊蛰, 春分, 清明, 谷雨, 立夏, 小满, 芒种, 夏至, 小暑, 大暑, 立秋, 处暑, 白露, 秋分, 寒露, 霜降, 立冬, 小雪, 大雪, 冬至, 小寒, 大寒. Starting from 立春, every other term is a 节 that starts a month. The rest are 中气.
- **SixtyCycleYear** The year pillar of an EightChar (年柱). It is the SixtyCycle of the year, which starts at 立春 rather than at the lunar new year.
- **SixtyCycleMonth** The month pillar of an EightChar (月柱). It is the SixtyCycle of the month. Each month starts at a 节: 立春 starts 寅月, 惊蛰 卯月, 清明 辰月, 立夏 巳月, 芒种 午月, 小暑 未月, 立秋 申月, 白露 酉月, 寒露 戌月, 立冬 亥月, 大雪 子月, 小寒 丑月.
- **SixtyCycleDay** The day pillar of an EightChar (日柱). It is the SixtyCycle of the day.
- **SixtyCycleHour** The hour pillar of an EightChar (时柱). It is the SixtyCycle of the hour.
- **DayMaster** The heavenly stem of the SixtyCycleDay (日主, 日元). It stands for the person in the EightChar, and every TenStar is read against it.
- **HeavenStemRestraint** One heavenly stem restrains both heavenly stems of the Element that its own Element restrains (天干相克). The pairs are 甲克戊, 甲克己, 乙克戊, 乙克己, 丙克庚, 丙克辛, 丁克庚, 丁克辛, 戊克壬, 戊克癸, 己克壬, 己克癸, 庚克甲, 庚克乙, 辛克甲, 辛克乙, 壬克丙, 壬克丁, 癸克丙, 癸克丁.
- **HeavenStemFiveCombination** Two heavenly stems that combine and transform into an element (天干五合). The pairs are 甲己合化土, 乙庚合化金, 丙辛合化水, 丁壬合化木, 戊癸合化火.
- **EarthBranchSixOpposition** Two earthly branches that sit opposite each other in the twelve-branch circle and clash (地支六冲). The pairs are 子午冲, 丑未冲, 寅申冲, 卯酉冲, 辰戌冲, 巳亥冲.
- **EarthBranchSixCombination** Two earthly branches that combine and transform into an element (地支六合). The pairs are 子丑合化土, 寅亥合化木, 卯戌合化火, 辰酉合化金, 巳申合化水, 午未合化土.
- **EarthBranchThreeCombination** Three earthly branches that combine into the frame of one element (地支三合). The groups are 申子辰合水局, 亥卯未合木局, 寅午戌合火局, 巳酉丑合金局.
- **EarthBranchHalfThreeCombination** Two branches of an EarthBranchThreeCombination that include its middle branch (子, 午, 卯, or 酉) and combine into a half frame of its element (地支半三合). The pairs are 申子半合水局, 子辰半合水局, 亥卯半合木局, 卯未半合木局, 寅午半合火局, 午戌半合火局, 巳酉半合金局, 酉丑半合金局.
- **EarthBranchPunishment** Earthly branches that punish each other (地支相刑). The groups are 寅巳申无恩之刑, 丑戌未恃势之刑, 子卯无礼之刑, and the self-punishments 辰辰自刑, 午午自刑, 酉酉自刑, 亥亥自刑.
- **TenStar** The relation of a heavenly stem to the DayMaster, set by their Element and YinYang (十神). The values are 比肩, 劫财, 食神, 伤官, 偏财, 正财, 七杀, 正官, 偏印, 正印.
- **HiddenHeavenStem** A heavenly stem hidden inside an earthly branch (藏干). Each branch holds one to three, listed as main qi, middle qi, then residual qi (本气, 中气, 余气). The values are 子藏癸, 丑藏己癸辛, 寅藏甲丙戊, 卯藏乙, 辰藏戊乙癸, 巳藏丙戊庚, 午藏丁己, 未藏己丁乙, 申藏庚壬戊, 酉藏辛, 戌藏戊辛丁, 亥藏壬甲.
- **HiddenHeavenStemType** The position of a HiddenHeavenStem inside its earthly branch (藏干类型). The values are 本气 (main qi), 中气 (middle qi), 余气 (residual qi).
- **DecadeFortune** A SixtyCycle that governs ten years of a life (大运). The sequence starts next to the SixtyCycleMonth and runs forward for a yang-year male or a yin-year female, and backward for a yin-year male or a yang-year female (阳男阴女顺排, 阴男阳女逆排).

## Non-negotiables

- Any prose surface → the unslop skill. Your reply is a prose surface. Write it per Writing the reply.
- Before commit → the deslop skill
- For testing -> the test-audit skill

## Git

- When Codex creates a commit, append `Co-authored-by: Codex <noreply@openai.com>` to the commit message.

## Pull requests

- Never make a PR unless the developer explicitly asks you to do so.
- Conventional commit titles, plain language: fix(web): new threads no longer spike CPU.
- Body: the problem in a sentence or two, then how you fixed it.
- UI changes need before/after images.
