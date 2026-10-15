import type { Chart } from '../chart/chart'

export function RelationsPanel({ chart }: { chart: Chart }) {
  return (
    <section>
      <h3 className="mb-3 text-sm text-stone-500">干支留意</h3>
      <dl className="flex flex-col gap-3">
        <Row title="天干留意" relations={chart.stemRelations} />
        <Row title="地支留意" relations={chart.branchRelations} />
      </dl>
    </section>
  )
}

function Row({ title, relations }: { title: string; relations: string[] }) {
  return (
    <div className="flex items-start gap-4">
      <dt className="w-16 shrink-0 pt-0.5 text-sm font-medium text-stone-700">{title}</dt>
      <dd className="flex flex-wrap gap-1.5">
        {relations.length === 0 ? (
          <span className="pt-0.5 text-sm text-stone-300">无</span>
        ) : (
          relations.map((label) => (
            <span key={label} className="rounded-lg bg-stone-100 px-2 py-0.5 text-sm text-stone-800">
              {label}
            </span>
          ))
        )}
      </dd>
    </div>
  )
}
