import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { castChart, type Chart } from './bazi/chart'
import { formToSearch, readFormFromUrl, toBirthInput, type BirthForm } from './birthForm'
import { BirthFormPanel } from './components/BirthFormPanel'
import { FortunePanel } from './components/FortunePanel'
import { PillarsTable } from './components/PillarsTable'
import { RelationsPanel } from './components/RelationsPanel'

export default function App() {
  const [form, setForm] = useState<BirthForm>(() => readFormFromUrl(window.location.search))
  const input = useMemo(() => toBirthInput(form), [form])
  const chart = useMemo(() => input && castChart(input), [input])

  useEffect(() => {
    window.history.replaceState(null, '', formToSearch(form))
  }, [form])

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-4 px-4 py-8 sm:py-12">
      <header className="mb-2">
        <h1 className="font-serif text-3xl font-semibold tracking-wide text-stone-900">八字排盘</h1>
      </header>

      <Card>
        <BirthFormPanel form={form} onChange={setForm} />
      </Card>

      {chart ? (
        <>
          <Card>
            <Summary chart={chart} />
          </Card>
          <Card>
            <PillarsTable chart={chart} />
          </Card>
          <Card>
            <RelationsPanel chart={chart} />
          </Card>
          <Card>
            <FortunePanel key={JSON.stringify(input)} chart={chart} />
          </Card>
        </>
      ) : (
        <Card>
          <p className="text-center text-sm text-stone-500">请输入 1900–2100 年之间的有效日期和时间</p>
        </Card>
      )}

      <footer className="mt-2 text-xs leading-relaxed text-stone-400">
        年柱以立春为界，月柱以节为界，精确到分钟。年龄均为虚岁。起运按三天折一年推算。
      </footer>
    </main>
  )
}

function Card({ children }: { children: ReactNode }) {
  return <section className="rounded-2xl bg-white/70 p-5 shadow-sm ring-1 ring-stone-200 sm:p-6">{children}</section>
}

function Summary({ chart }: { chart: Chart }) {
  const { year, month, day } = chart.solarTime
  return (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm sm:grid-cols-3">
      <Item label="公历">
        {year}年{month}月{day}日
      </Item>
      <Item label="农历">{chart.lunarDate.replace('农历', '')}</Item>
      <Item label="属相">{chart.zodiac}</Item>
    </dl>
  )
}

function Item({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-xs text-stone-400">{label}</dt>
      <dd className="text-stone-800">{children}</dd>
    </div>
  )
}
