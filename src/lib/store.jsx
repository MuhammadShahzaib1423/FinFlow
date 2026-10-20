import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { EXPENSE_CATEGORIES } from './finance'

const STORAGE_KEY = 'finflow_state_v1'

const uid = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`

const iso = (y, m, d) =>
  new Date(y, m, d).toISOString().slice(0, 10)

function seedTransactions() {
  const now = new Date()
  const Y = now.getFullYear()
  const M = now.getMonth()
  const tx = []
  const push = (monthsAgo, day, title, category, type, amount) => {
    const d = new Date(Y, M - monthsAgo, Math.min(day, 28))
    tx.push({
      id: uid() + tx.length,
      title,
      category,
      type,
      amount,
      date: iso(d.getFullYear(), d.getMonth(), d.getDate()),
    })
  }

  // Six months of a plausible fictional household ledger
  for (let ago = 5; ago >= 0; ago--) {
    const jitter = (base, pct, salt) =>
      Math.round(base * (1 + (((ago * 7 + salt * 13) % 11) - 5) * pct / 100))
    push(ago, 1, 'Monthly salary — NovaByte Studio', 'Salary', 'income', jitter(285000, 1, 1))
    push(ago, 2, 'Rent — Gulberg apartment', 'Housing', 'expense', 85000)
    push(ago, 4, 'Electricity & utilities', 'Housing', 'expense', jitter(18400, 12, 2))
    push(ago, 6, 'Weekly groceries — FreshMart', 'Food', 'expense', jitter(21500, 10, 3))
    push(ago, 9, 'Dinner with family — Salt & Sage', 'Food', 'expense', jitter(6800, 15, 4))
    push(ago, 11, 'Fuel — Shell petrol pump', 'Transport', 'expense', jitter(12500, 10, 5))
    push(ago, 13, 'Ride bookings — city trips', 'Transport', 'expense', jitter(4200, 18, 6))
    push(ago, 15, 'Freelance design sprint', 'Freelance', 'income', ago % 2 === 0 ? jitter(45000, 10, 7) : jitter(32000, 10, 7))
    push(ago, 17, 'Groceries — FreshMart', 'Food', 'expense', jitter(19800, 10, 8))
    push(ago, 19, 'Clothing — Northwind Outlet', 'Shopping', 'expense', jitter(15400, 20, 9))
    push(ago, 21, 'Streaming & cinema', 'Entertainment', 'expense', jitter(5400, 15, 10))
    push(ago, 23, 'Pharmacy & check-up', 'Health', 'expense', jitter(7300, 20, 11))
    push(ago, 25, 'Mobile recharge & internet', 'Other', 'expense', jitter(5600, 8, 12))
    if (ago % 2 === 1) push(ago, 26, 'Dividend payout — index fund', 'Investments', 'income', 9600)
  }
  // A couple of extra recent items so "today" feels current
  push(0, Math.min(now.getDate(), 28), 'Coffee & brunch — Daily Grind', 'Food', 'expense', 2450)
  push(0, Math.min(now.getDate(), 28), 'Bookshop — paperback novels', 'Entertainment', 'expense', 3900)

  return tx.sort((a, b) => (a.date < b.date ? 1 : -1))
}

function seedState() {
  return {
    transactions: seedTransactions(),
    budgets: {
      Housing: 110000,
      Food: 55000,
      Transport: 22000,
      Shopping: 30000,
      Entertainment: 15000,
      Health: 20000,
      Other: 12000,
    },
    goals: [
      { id: uid() + 'g1', name: 'Emergency fund', target: 500000, saved: 325000, deadline: '2027-06-30', colour: '#159466' },
      { id: uid() + 'g2', name: 'Trip to the northern areas', target: 180000, saved: 86400, deadline: '2027-01-15', colour: '#e3b94e' },
      { id: uid() + 'g3', name: 'New laptop', target: 320000, saved: 118000, deadline: '2027-03-31', colour: '#4c8dc7' },
    ],
  }
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return seedState()
    const parsed = JSON.parse(raw)
    if (!parsed || !Array.isArray(parsed.transactions) || !parsed.budgets || !Array.isArray(parsed.goals)) {
      return seedState()
    }
    return parsed
  } catch {
    return seedState()
  }
}

const FinanceContext = createContext(null)

export function FinanceProvider({ children }) {
  const [state, setState] = useState(loadState)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* storage full/blocked — app still works in-memory */
    }
  }, [state])

  const api = useMemo(
    () => ({
      transactions: state.transactions,
      budgets: state.budgets,
      goals: state.goals,
      addTransaction: (tx) =>
        setState((s) => ({ ...s, transactions: [{ ...tx, id: uid() }, ...s.transactions] })),
      updateTransaction: (id, tx) =>
        setState((s) => ({
          ...s,
          transactions: s.transactions.map((t) => (t.id === id ? { ...t, ...tx, id } : t)),
        })),
      deleteTransaction: (id) =>
        setState((s) => ({ ...s, transactions: s.transactions.filter((t) => t.id !== id) })),
      setBudget: (category, limit) =>
        setState((s) => ({ ...s, budgets: { ...s.budgets, [category]: limit } })),
      addGoal: (goal) =>
        setState((s) => ({ ...s, goals: [...s.goals, { ...goal, id: uid(), saved: goal.saved || 0 }] })),
      contributeToGoal: (id, amount) =>
        setState((s) => ({
          ...s,
          goals: s.goals.map((g) =>
            g.id === id ? { ...g, saved: Math.min(g.target, Math.max(0, g.saved + amount)) } : g
          ),
        })),
      deleteGoal: (id) => setState((s) => ({ ...s, goals: s.goals.filter((g) => g.id !== id) })),
      resetDemo: () => setState(seedState()),
    }),
    [state]
  )

  return <FinanceContext.Provider value={api}>{children}</FinanceContext.Provider>
}

export const useFinance = () => {
  const ctx = useContext(FinanceContext)
  if (!ctx) throw new Error('useFinance must be used inside FinanceProvider')
  return ctx
}

export { EXPENSE_CATEGORIES }
