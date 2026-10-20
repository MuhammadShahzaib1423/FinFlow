export default function PageHeader({ eyebrow, title, sub, action }) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-mint-600">{eyebrow}</p>
        <h1 className="mt-1 font-display text-3xl font-bold text-pine-950">{title}</h1>
        {sub && <p className="mt-1 max-w-xl text-sm text-pine-900/55">{sub}</p>}
      </div>
      {action}
    </div>
  )
}
