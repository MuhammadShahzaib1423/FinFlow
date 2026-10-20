import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useFinance } from '../lib/store'
import { fmtDate, fmtRs } from '../lib/finance'
import PageHeader from '../components/PageHeader'

const GOAL_COLOURS = ['#159466', '#e3b94e', '#4c8dc7', '#c76ba0', '#8a6bc7']
const inputCls =
  'w-full rounded-xl border border-pine-900/15 bg-white px-3.5 py-2.5 text-sm text-pine-950 outline-none focus:border-mint-500 focus:ring-2 focus:ring-mint-500/25'

export default function Goals() {
  const { goals, addGoal, contributeToGoal, deleteGoal } = useFinance()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', target: '', saved: '', deadline: '' })
  const [error, setError] = useState('')
  const [amounts, setAmounts] = useState({})

  const totalSaved = goals.reduce((s, g) => s + g.saved, 0)
  const totalTarget = goals.reduce((s, g) => s + g.target, 0)

  const submit = (e) => {
    e.preventDefault()
    const target = Number(form.target)
    const saved = Number(form.saved) || 0
    if (!form.name.trim()) return setError('Give the goal a name.')
    if (!target || target <= 0) return setError('Set a target above zero.')
    if (saved < 0 || saved > target) return setError('Starting amount must be between zero and the target.')
    addGoal({
      name: form.name.trim(),
      target,
      saved,
      deadline: form.deadline || '',
      colour: GOAL_COLOURS[goals.length % GOAL_COLOURS.length],
    })
    setForm({ name: '', target: '', saved: '', deadline: '' })
    setError('')
    setShowForm(false)
  }

  const contribute = (g) => {
    const v = Number(amounts[g.id])
    if (!v || v <= 0) return
    contributeToGoal(g.id, v)
    setAmounts((a) => ({ ...a, [g.id]: '' }))
  }

  return (
    <div>
      <PageHeader
        eyebrow="Save with intent"
        title="Savings goals"
        sub="Named pots for the things that matter. Add contributions whenever you can — small and regular beats big and rare."
        action={
          <button onClick={() => setShowForm((s) => !s)} className="rounded-xl bg-pine-900 px-5 py-3 font-display text-sm font-bold text-white shadow-card transition hover:bg-pine-800">
            {showForm ? 'Close form' : '+ New goal'}
          </button>
        }
      />

      <div className="mb-6 flex flex-wrap items-center gap-x-8 gap-y-2 rounded-3xl bg-pine-900 px-6 py-5 text-white shadow-card">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-mint-300">Saved across goals</p>
          <p className="font-display text-2xl font-bold">{fmtRs(totalSaved)}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-mint-300">Combined target</p>
          <p className="font-display text-2xl font-bold">{fmtRs(totalTarget)}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-mint-300">Overall progress</p>
          <p className="font-display text-2xl font-bold">{totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0}%</p>
        </div>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            onSubmit={submit} className="mb-6 overflow-hidden rounded-3xl bg-white shadow-card"
          >
            <div className="grid gap-4 p-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-pine-900/50">Goal name</label>
                <input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Family holiday" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-pine-900/50">Target (Rs)</label>
                <input className={inputCls} type="number" min="0" value={form.target} onChange={(e) => setForm({ ...form, target: e.target.value })} placeholder="200000" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-pine-900/50">Already saved (Rs)</label>
                <input className={inputCls} type="number" min="0" value={form.saved} onChange={(e) => setForm({ ...form, saved: e.target.value })} placeholder="0" />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-pine-900/50">Target date (optional)</label>
                <input className={inputCls} type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
              </div>
              {error && <p className="text-sm text-rose-600 sm:col-span-2">{error}</p>}
              <button type="submit" className="rounded-xl bg-mint-600 py-3 font-display text-sm font-bold text-white transition hover:bg-mint-500 sm:col-span-2">
                Create goal
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {goals.map((g, i) => {
          const pct = g.target > 0 ? Math.min(100, Math.round((g.saved / g.target) * 100)) : 0
          const done = g.saved >= g.target
          return (
            <motion.article
              key={g.id}
              initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
              className="flex flex-col rounded-3xl bg-white p-5 shadow-card"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="h-2.5 w-10 rounded-full" style={{ backgroundColor: g.colour }} />
                <button onClick={() => deleteGoal(g.id)} aria-label={`Delete ${g.name}`} className="rounded-lg p-1.5 text-pine-900/30 hover:bg-rose-50 hover:text-rose-600">
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6.5 7l1 13h9l1-13" /></svg>
                </button>
              </div>
              <h2 className="mt-3 font-display text-lg font-bold text-pine-950">{g.name}</h2>
              <p className="text-sm text-pine-900/55">
                {fmtRs(g.saved)} <span className="text-pine-900/40">of</span> {fmtRs(g.target)}
                {g.deadline && <span className="block text-xs">Target date: {fmtDate(g.deadline)}</span>}
              </p>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-pine-900/10">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: g.colour }}
                  initial={{ width: 0 }} whileInView={{ width: `${pct}%` }} viewport={{ once: true }}
                  transition={{ duration: 0.9, ease: 'easeOut' }}
                />
              </div>
              <p className="mt-2 text-sm font-semibold" style={{ color: g.colour }}>
                {done ? 'Goal reached — nicely done.' : `${pct}% · ${fmtRs(g.target - g.saved)} to go`}
              </p>
              {!done && (
                <div className="mt-4 flex gap-2 border-t border-pine-900/5 pt-4">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-pine-900/40">Rs</span>
                    <input
                      type="number" min="0" value={amounts[g.id] || ''}
                      onChange={(e) => setAmounts((a) => ({ ...a, [g.id]: e.target.value }))}
                      onKeyDown={(e) => e.key === 'Enter' && contribute(g)}
                      placeholder="Add money"
                      className="w-full rounded-xl border border-pine-900/15 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-mint-500 focus:ring-2 focus:ring-mint-500/25"
                    />
                  </div>
                  <button onClick={() => contribute(g)} className="rounded-xl bg-pine-900 px-4 text-sm font-semibold text-white hover:bg-pine-800">
                    Add
                  </button>
                </div>
              )}
            </motion.article>
          )
        })}
        {goals.length === 0 && (
          <div className="rounded-3xl bg-white p-8 text-center shadow-card md:col-span-2 xl:col-span-3">
            <p className="font-display text-lg font-bold text-pine-950">No goals yet</p>
            <p className="mt-1 text-sm text-pine-900/50">Create your first savings goal with the button above.</p>
          </div>
        )}
      </div>
    </div>
  )
}
