import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useFinance } from '../lib/store'
import { CATEGORY_COLORS, EXPENSE_CATEGORIES, currentMonthKey, fmtRs, monthKey } from '../lib/finance'
import PageHeader from '../components/PageHeader'
import Icon from '../components/Icon'
import { CATEGORY_ICONS } from '../lib/finance'

export default function Budget() {
  const { transactions, budgets, setBudget } = useFinance()
  const [editing, setEditing] = useState(null)
  const [draft, setDraft] = useState('')

  const spent = useMemo(() => {
    const ck = currentMonthKey()
    const map = {}
    for (const c of EXPENSE_CATEGORIES) map[c] = 0
    for (const t of transactions) {
      if (t.type === 'expense' && monthKey(t.date) === ck && map[t.category] !== undefined) {
        map[t.category] += t.amount
      }
    }
    return map
  }, [transactions])

  const totals = useMemo(() => {
    const limit = EXPENSE_CATEGORIES.reduce((s, c) => s + (budgets[c] || 0), 0)
    const used = EXPENSE_CATEGORIES.reduce((s, c) => s + spent[c], 0)
    return { limit, used, left: limit - used }
  }, [budgets, spent])

  const save = (category) => {
    const v = Number(draft)
    if (!Number.isNaN(v) && v >= 0) setBudget(category, v)
    setEditing(null)
  }

  return (
    <div>
      <PageHeader
        eyebrow="Monthly plan"
        title="Budget"
        sub="Limits for this month, measured against what you have actually spent. Tap a limit to change it."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-3xl bg-pine-900 p-5 text-white shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wider text-mint-300">Total budget</p>
          <p className="mt-2 font-display text-2xl font-bold">{fmtRs(totals.limit)}</p>
        </div>
        <div className="rounded-3xl bg-white p-5 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wider text-pine-900/45">Spent so far</p>
          <p className="mt-2 font-display text-2xl font-bold text-pine-950">{fmtRs(totals.used)}</p>
        </div>
        <div className="rounded-3xl bg-white p-5 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wider text-pine-900/45">Still available</p>
          <p className={`mt-2 font-display text-2xl font-bold ${totals.left < 0 ? 'text-rose-600' : 'text-mint-600'}`}>{fmtRs(totals.left)}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {EXPENSE_CATEGORIES.map((c, i) => {
          const limit = budgets[c] || 0
          const used = spent[c]
          const pct = limit > 0 ? Math.round((used / limit) * 100) : 0
          const over = limit > 0 && used > limit
          const near = !over && pct >= 80
          const colour = CATEGORY_COLORS[c]
          return (
            <motion.article
              key={c}
              initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className={`rounded-3xl bg-white p-5 shadow-card ${over ? 'ring-2 ring-rose-300' : ''}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="grid w-11 h-11 place-items-center rounded-2xl" style={{ backgroundColor: `${colour}1f`, color: colour }}>
                    <Icon d={CATEGORY_ICONS[c]} className="w-6 h-6" />
                  </span>
                  <div>
                    <h2 className="font-display text-base font-bold text-pine-950">{c}</h2>
                    <p className="text-xs text-pine-900/50">{fmtRs(used)} spent of {fmtRs(limit)}</p>
                  </div>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${over ? 'bg-rose-100 text-rose-700' : near ? 'bg-amber-100 text-amber-700' : 'bg-mint-500/10 text-mint-600'}`}>
                  {over ? 'Over budget' : `${pct}% used`}
                </span>
              </div>

              <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-pine-900/10">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: over ? '#e05252' : colour }}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${Math.min(100, pct)}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, ease: 'easeOut' }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className={over ? 'font-semibold text-rose-600' : 'text-pine-900/50'}>
                  {over ? `${fmtRs(used - limit)} over the limit` : `${fmtRs(limit - used)} left this month`}
                </span>
                {editing === c ? (
                  <span className="flex items-center gap-1.5">
                    <span className="text-pine-900/50">Rs</span>
                    <input
                      type="number" min="0" autoFocus value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && save(c)}
                      className="w-24 rounded-lg border border-pine-900/15 px-2 py-1 text-sm outline-none focus:border-mint-500"
                    />
                    <button onClick={() => save(c)} className="rounded-lg bg-pine-900 px-2.5 py-1 font-semibold text-white">Save</button>
                    <button onClick={() => setEditing(null)} className="rounded-lg bg-pine-900/5 px-2.5 py-1 font-semibold text-pine-900">Cancel</button>
                  </span>
                ) : (
                  <button
                    onClick={() => { setEditing(c); setDraft(String(limit)) }}
                    className="font-semibold text-mint-600 hover:text-mint-500"
                  >
                    Edit limit
                  </button>
                )}
              </div>
            </motion.article>
          )
        })}
      </div>

      <p className="mt-6 text-sm text-pine-900/55">
        Spending is worked out from your <Link to="/transactions" className="font-semibold text-mint-600">transactions</Link> for the current month, so adding an expense updates its budget straight away.
      </p>
    </div>
  )
}
