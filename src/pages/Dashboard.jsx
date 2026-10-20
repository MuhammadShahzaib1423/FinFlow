import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import { useFinance } from '../lib/store'
import {
  CATEGORY_COLORS, currentMonthKey, fmtRs, fmtRsShort, lastNMonthKeys, monthKey, monthLabel,
} from '../lib/finance'
import Counter from '../components/Counter'
import PageHeader from '../components/PageHeader'
import TransactionRow from '../components/TransactionRow'
import TransactionModal from '../components/TransactionModal'

const cardMotion = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
}

function ChartTip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-pine-900/10 bg-white px-3 py-2 text-xs shadow-card">
      {label && <p className="mb-1 font-semibold text-pine-950">{label}</p>}
      {payload.map((p) => (
        <p key={p.dataKey || p.name} style={{ color: p.color || p.payload?.fill }}>
          {p.name}: <strong>{fmtRs(p.value)}</strong>
        </p>
      ))}
    </div>
  )
}

export default function Dashboard() {
  const { transactions, goals, addTransaction } = useFinance()
  const [modalOpen, setModalOpen] = useState(false)

  const stats = useMemo(() => {
    const ck = currentMonthKey()
    let balance = 0, mIn = 0, mOut = 0
    for (const t of transactions) {
      balance += t.type === 'income' ? t.amount : -t.amount
      if (monthKey(t.date) === ck) {
        if (t.type === 'income') mIn += t.amount
        else mOut += t.amount
      }
    }
    const rate = mIn > 0 ? Math.max(0, Math.round(((mIn - mOut) / mIn) * 100)) : 0
    return { balance, mIn, mOut, rate }
  }, [transactions])

  const categoryData = useMemo(() => {
    const ck = currentMonthKey()
    const map = new Map()
    for (const t of transactions) {
      if (t.type === 'expense' && monthKey(t.date) === ck) {
        map.set(t.category, (map.get(t.category) || 0) + t.amount)
      }
    }
    return [...map.entries()]
      .map(([name, value]) => ({ name, value, fill: CATEGORY_COLORS[name] || '#8a938e' }))
      .sort((a, b) => b.value - a.value)
  }, [transactions])

  const trendData = useMemo(() => {
    return lastNMonthKeys(6).map((k) => {
      let income = 0, expenses = 0
      for (const t of transactions) {
        if (monthKey(t.date) !== k) continue
        if (t.type === 'income') income += t.amount
        else expenses += t.amount
      }
      return { month: monthLabel(k), Income: income, Expenses: expenses }
    })
  }, [transactions])

  const recent = transactions.slice(0, 6)
  const topGoal = goals[0]

  const cards = [
    { label: 'Total balance', value: stats.balance, format: fmtRs, accent: 'bg-pine-900 text-white', sub: 'Across all accounts' },
    { label: 'Income — this month', value: stats.mIn, format: fmtRs, accent: 'bg-white', sub: 'Salary, freelance & more' },
    { label: 'Expenses — this month', value: stats.mOut, format: fmtRs, accent: 'bg-white', sub: `${categoryData.length} categories tracked` },
    { label: 'Savings rate', value: stats.rate, format: (v) => `${Math.round(v)}%`, accent: 'bg-white', sub: 'Of this month\u2019s income kept' },
  ]

  return (
    <div>
      <PageHeader
        eyebrow="Overview"
        title="Good to see you, Ahmad"
        sub="A calm snapshot of your money this month — income, spending, budgets and goals in one place."
        action={
          <button onClick={() => setModalOpen(true)} className="rounded-xl bg-pine-900 px-5 py-3 font-display text-sm font-bold text-white shadow-card transition hover:bg-pine-800">
            + Add transaction
          </button>
        }
      />

      {/* Stat cards — offset, non-uniform layout */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c, i) => (
          <motion.div key={c.label} {...cardMotion} transition={{ delay: i * 0.07 }} className={`rounded-3xl p-5 shadow-card ${c.accent} ${i === 0 ? 'sm:col-span-2 xl:col-span-1' : ''}`}>
            <p className={`text-xs font-semibold uppercase tracking-wider ${c.accent.includes('pine-900') ? 'text-mint-300' : 'text-pine-900/45'}`}>{c.label}</p>
            <p className={`mt-2 font-display text-[26px] font-bold leading-tight ${c.accent.includes('pine-900') ? 'text-white' : 'text-pine-950'}`}>
              <Counter value={c.value} format={c.format} />
            </p>
            <p className={`mt-1 text-xs ${c.accent.includes('pine-900') ? 'text-emerald-100/60' : 'text-pine-900/45'}`}>{c.sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-5">
        {/* Trend chart */}
        <motion.section {...cardMotion} className="rounded-3xl bg-white p-5 shadow-card xl:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-display text-base font-bold text-pine-950">Income vs expenses</h2>
              <p className="text-xs text-pine-900/50">Last six months</p>
            </div>
            <span className="flex gap-4 text-xs font-medium text-pine-900/60">
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-mint-500" /> Income</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-gold-400" /> Expenses</span>
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 4, right: 4, bottom: 0, left: 4 }}>
                <defs>
                  <linearGradient id="gIn" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22b07d" stopOpacity={0.32} />
                    <stop offset="100%" stopColor="#22b07d" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="gOut" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#e3b94e" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#e3b94e" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 6" stroke="#0e292114" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#0e292180' }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={fmtRsShort} tick={{ fontSize: 11, fill: '#0e292180' }} axisLine={false} tickLine={false} width={72} />
                <Tooltip content={<ChartTip />} />
                <Area type="monotone" dataKey="Income" stroke="#159466" strokeWidth={2.2} fill="url(#gIn)" />
                <Area type="monotone" dataKey="Expenses" stroke="#d4a017" strokeWidth={2.2} fill="url(#gOut)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.section>

        {/* Donut */}
        <motion.section {...cardMotion} className="rounded-3xl bg-white p-5 shadow-card xl:col-span-2">
          <h2 className="font-display text-base font-bold text-pine-950">Where it went</h2>
          <p className="text-xs text-pine-900/50">Spending by category, this month</p>
          <div className="relative h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} dataKey="value" nameKey="name" innerRadius={62} outerRadius={88} paddingAngle={2} strokeWidth={0}>
                  {categoryData.map((d) => <Cell key={d.name} fill={d.fill} />)}
                </Pie>
                <Tooltip content={<ChartTip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 grid place-items-center">
              <div className="text-center">
                <p className="font-display text-lg font-bold text-pine-950">{fmtRsShort(stats.mOut)}</p>
                <p className="text-[11px] uppercase tracking-wide text-pine-900/45">spent</p>
              </div>
            </div>
          </div>
          <ul className="mt-2 space-y-1.5">
            {categoryData.slice(0, 5).map((d) => (
              <li key={d.name} className="flex items-center gap-2 text-sm">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.fill }} />
                <span className="flex-1 text-pine-900/70">{d.name}</span>
                <span className="font-semibold text-pine-950">{fmtRs(d.value)}</span>
              </li>
            ))}
            {categoryData.length === 0 && <li className="text-sm text-pine-900/50">No expenses recorded this month yet.</li>}
          </ul>
        </motion.section>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-5">
        {/* Recent transactions */}
        <motion.section {...cardMotion} className="overflow-hidden rounded-3xl bg-white shadow-card xl:col-span-3">
          <div className="flex items-center justify-between px-5 pt-5">
            <h2 className="font-display text-base font-bold text-pine-950">Recent activity</h2>
            <Link to="/transactions" className="text-sm font-semibold text-mint-600 hover:text-mint-500">View all →</Link>
          </div>
          <div className="divide-y divide-pine-900/5 py-2">
            {recent.map((t) => <TransactionRow key={t.id} tx={t} />)}
            {recent.length === 0 && <p className="px-5 py-6 text-sm text-pine-900/50">No transactions yet — add your first one above.</p>}
          </div>
        </motion.section>

        {/* Savings goal spotlight */}
        <motion.section {...cardMotion} className="rounded-3xl bg-pine-900 p-5 text-white shadow-card xl:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-mint-300">Top savings goal</p>
          {topGoal ? (
            <>
              <h2 className="mt-2 font-display text-xl font-bold">{topGoal.name}</h2>
              <p className="mt-1 text-sm text-emerald-100/60">{fmtRs(topGoal.saved)} of {fmtRs(topGoal.target)}</p>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-mint-500 to-mint-300"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${Math.min(100, (topGoal.saved / topGoal.target) * 100)}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>
              <p className="mt-2 text-sm font-semibold text-mint-300">{Math.round((topGoal.saved / topGoal.target) * 100)}% there</p>
              <Link to="/goals" className="mt-5 inline-block rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/15">
                Manage goals →
              </Link>
            </>
          ) : (
            <>
              <h2 className="mt-2 font-display text-xl font-bold">No goals yet</h2>
              <p className="mt-1 text-sm text-emerald-100/60">Set a target and watch it grow.</p>
              <Link to="/goals" className="mt-5 inline-block rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/15">
                Create a goal →
              </Link>
            </>
          )}
          <div className="mt-6 border-t border-white/10 pt-4">
            <p className="text-xs leading-relaxed text-emerald-100/50">
              Steady habit: moving even a small amount on payday keeps the savings rate healthy without feeling it later in the month.
            </p>
          </div>
        </motion.section>
      </div>

      <TransactionModal open={modalOpen} onClose={() => setModalOpen(false)} onSave={addTransaction} />
    </div>
  )
}
