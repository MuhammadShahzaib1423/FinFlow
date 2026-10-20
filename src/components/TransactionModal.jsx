import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../lib/finance'

const empty = () => ({
  title: '',
  type: 'expense',
  category: 'Food',
  amount: '',
  date: new Date().toISOString().slice(0, 10),
})

export default function TransactionModal({ open, initial, onClose, onSave }) {
  const [form, setForm] = useState(empty)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (open) {
      setForm(initial ? { ...initial, amount: String(initial.amount) } : empty())
      setErrors({})
    }
  }, [open, initial])

  const set = (k, v) => {
    setForm((f) => {
      const next = { ...f, [k]: v }
      if (k === 'type') {
        const cats = v === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES
        if (!cats.includes(next.category)) next.category = cats[0]
      }
      return next
    })
    setErrors((e) => ({ ...e, [k]: undefined }))
  }

  const submit = (e) => {
    e.preventDefault()
    const errs = {}
    if (!form.title.trim()) errs.title = 'Give this transaction a short title.'
    const amount = Number(form.amount)
    if (!form.amount || Number.isNaN(amount) || amount <= 0) errs.amount = 'Enter an amount above zero.'
    if (!form.date) errs.date = 'Pick a date.'
    setErrors(errs)
    if (Object.keys(errs).length) return
    onSave({ title: form.title.trim(), type: form.type, category: form.category, amount, date: form.date })
    onClose()
  }

  const categories = form.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES
  const inputCls =
    'w-full rounded-xl border border-pine-900/15 bg-white px-3.5 py-2.5 text-sm text-pine-950 outline-none transition focus:border-mint-500 focus:ring-2 focus:ring-mint-500/25'

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center">
          <motion.div className="absolute inset-0 bg-pine-950/60 backdrop-blur-[2px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div
            className="relative w-full max-w-md rounded-t-3xl bg-ivory-50 p-6 shadow-2xl sm:rounded-3xl"
            initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }} transition={{ type: 'spring', damping: 26, stiffness: 300 }}
          >
            <div className="mb-5 flex items-start justify-between">
              <div>
                <h2 className="font-display text-xl font-bold text-pine-950">{initial ? 'Edit transaction' : 'Add transaction'}</h2>
                <p className="text-sm text-pine-900/50">Saved straight away to this browser.</p>
              </div>
              <button onClick={onClose} aria-label="Close" className="rounded-lg p-2 text-pine-900/50 hover:bg-pine-900/5">
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
              </button>
            </div>

            <form onSubmit={submit} className="space-y-4" noValidate>
              <div className="grid grid-cols-2 gap-2 rounded-2xl bg-pine-900/5 p-1.5">
                {['expense', 'income'].map((t) => (
                  <button
                    key={t} type="button" onClick={() => set('type', t)}
                    className={`rounded-xl py-2 text-sm font-semibold capitalize transition ${form.type === t ? 'bg-pine-900 text-white shadow' : 'text-pine-900/60 hover:text-pine-950'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-pine-900/50">Title</label>
                <input className={inputCls} value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="e.g. Weekly groceries" />
                {errors.title && <p className="mt-1 text-xs text-rose-600">{errors.title}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-pine-900/50">Amount (Rs)</label>
                  <input className={inputCls} type="number" min="0" step="any" value={form.amount} onChange={(e) => set('amount', e.target.value)} placeholder="0" />
                  {errors.amount && <p className="mt-1 text-xs text-rose-600">{errors.amount}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-pine-900/50">Date</label>
                  <input className={inputCls} type="date" value={form.date} onChange={(e) => set('date', e.target.value)} />
                  {errors.date && <p className="mt-1 text-xs text-rose-600">{errors.date}</p>}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-pine-900/50">Category</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((c) => (
                    <button
                      key={c} type="button" onClick={() => set('category', c)}
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${form.category === c ? 'bg-mint-600 text-white' : 'bg-pine-900/5 text-pine-900/70 hover:bg-pine-900/10'}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" className="w-full rounded-xl bg-pine-900 py-3 font-display text-sm font-bold text-white transition hover:bg-pine-800">
                {initial ? 'Save changes' : 'Add transaction'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
