import { useMemo, useState } from 'react'
import { useFinance } from '../lib/store'
import { ALL_CATEGORIES, fmtRs } from '../lib/finance'
import PageHeader from '../components/PageHeader'
import TransactionRow from '../components/TransactionRow'
import TransactionModal from '../components/TransactionModal'

export default function Transactions() {
  const { transactions, addTransaction, updateTransaction, deleteTransaction } = useFinance()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [type, setType] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return transactions.filter((t) => {
      if (type !== 'all' && t.type !== type) return false
      if (category !== 'all' && t.category !== category) return false
      if (q && !`${t.title} ${t.category}`.toLowerCase().includes(q)) return false
      return true
    })
  }, [transactions, query, category, type])

  const totals = useMemo(() => {
    let inc = 0, out = 0
    for (const t of filtered) {
      if (t.type === 'income') inc += t.amount
      else out += t.amount
    }
    return { inc, out, net: inc - out }
  }, [filtered])

  const selectCls =
    'rounded-xl border border-pine-900/15 bg-white px-3 py-2.5 text-sm text-pine-950 outline-none focus:border-mint-500 focus:ring-2 focus:ring-mint-500/25'

  return (
    <div>
      <PageHeader
        eyebrow="Ledger"
        title="Transactions"
        sub="Every rupee in and out. Search, filter, edit or remove entries — changes save automatically."
        action={
          <button
            onClick={() => { setEditing(null); setModalOpen(true) }}
            className="rounded-xl bg-pine-900 px-5 py-3 font-display text-sm font-bold text-white shadow-card transition hover:bg-pine-800"
          >
            + Add transaction
          </button>
        }
      />

      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative min-w-[220px] flex-1">
          <svg viewBox="0 0 24 24" className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-pine-900/35" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
          <input
            value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search title or category…"
            className="w-full rounded-xl border border-pine-900/15 bg-white py-2.5 pl-11 pr-3.5 text-sm outline-none focus:border-mint-500 focus:ring-2 focus:ring-mint-500/25"
          />
        </div>
        <select value={type} onChange={(e) => setType(e.target.value)} className={selectCls} aria-label="Filter by type">
          <option value="all">All types</option>
          <option value="income">Income</option>
          <option value="expense">Expenses</option>
        </select>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className={selectCls} aria-label="Filter by category">
          <option value="all">All categories</option>
          {ALL_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="mb-4 grid grid-cols-3 gap-3">
        {[
          { l: 'Income (shown)', v: totals.inc, cls: 'text-mint-600' },
          { l: 'Expenses (shown)', v: totals.out, cls: 'text-pine-950' },
          { l: 'Net', v: totals.net, cls: totals.net >= 0 ? 'text-mint-600' : 'text-rose-600' },
        ].map((s) => (
          <div key={s.l} className="rounded-2xl bg-white p-4 shadow-card">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-pine-900/45">{s.l}</p>
            <p className={`mt-1 font-display text-base font-bold sm:text-lg ${s.cls}`}>{fmtRs(s.v)}</p>
          </div>
        ))}
      </div>

      <section className="overflow-hidden rounded-3xl bg-white shadow-card">
        <div className="divide-y divide-pine-900/5">
          {filtered.map((t) => (
            <TransactionRow
              key={t.id} tx={t}
              actions={{
                onEdit: (tx) => { setEditing(tx); setModalOpen(true) },
                onDelete: (tx) => setConfirmDelete(tx),
              }}
            />
          ))}
          {filtered.length === 0 && (
            <div className="px-5 py-12 text-center">
              <p className="font-display text-lg font-bold text-pine-950">Nothing matches</p>
              <p className="mt-1 text-sm text-pine-900/50">Try a different search or clear the filters.</p>
            </div>
          )}
        </div>
        <p className="border-t border-pine-900/5 px-5 py-3 text-xs text-pine-900/45">
          Showing {filtered.length} of {transactions.length} transactions
        </p>
      </section>

      <TransactionModal
        open={modalOpen}
        initial={editing}
        onClose={() => { setModalOpen(false); setEditing(null) }}
        onSave={(data) => (editing ? updateTransaction(editing.id, data) : addTransaction(data))}
      />

      {confirmDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-pine-950/60" onClick={() => setConfirmDelete(null)} />
          <div className="relative w-full max-w-sm rounded-3xl bg-ivory-50 p-6 shadow-2xl">
            <h3 className="font-display text-lg font-bold text-pine-950">Delete this transaction?</h3>
            <p className="mt-1.5 text-sm text-pine-900/60">
              “{confirmDelete.title}” ({fmtRs(confirmDelete.amount)}) will be removed. This cannot be undone.
            </p>
            <div className="mt-5 flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 rounded-xl bg-pine-900/5 py-2.5 text-sm font-semibold text-pine-900 hover:bg-pine-900/10">Keep it</button>
              <button
                onClick={() => { deleteTransaction(confirmDelete.id); setConfirmDelete(null) }}
                className="flex-1 rounded-xl bg-rose-600 py-2.5 text-sm font-semibold text-white hover:bg-rose-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
