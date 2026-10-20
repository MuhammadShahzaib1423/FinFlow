export const EXPENSE_CATEGORIES = [
  'Housing',
  'Food',
  'Transport',
  'Shopping',
  'Entertainment',
  'Health',
  'Other',
]

export const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investments', 'Other Income']

export const ALL_CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES]

export const CATEGORY_COLORS = {
  Housing: '#159466',
  Food: '#e3b94e',
  Transport: '#4c8dc7',
  Shopping: '#c76ba0',
  Entertainment: '#8a6bc7',
  Health: '#c7554c',
  Other: '#8a938e',
  Salary: '#22b07d',
  Freelance: '#4cc79a',
  Investments: '#d4a017',
  'Other Income': '#7fb069',
}

export const CATEGORY_ICONS = {
  Housing: 'M3 11.5 12 4l9 7.5M5.5 10v10h13V10',
  Food: 'M6 3v7a2 2 0 0 0 2 2v9M8 3v18M18 3c-2 0-3 2.5-3 5v4h3v9',
  Transport: 'M4 16l1.5-6A2 2 0 0 1 7.4 8.5h9.2a2 2 0 0 1 1.9 1.5L20 16M4 16h16M4 16v4m16-4v4M7 20h.01M17 20h.01M7 13.5h.01M17 13.5h.01',
  Shopping: 'M5 8h14l-1.2 12a1.5 1.5 0 0 1-1.5 1.3H7.7A1.5 1.5 0 0 1 6.2 20L5 8ZM8.5 10V6.5a3.5 3.5 0 0 1 7 0V10',
  Entertainment: 'M5 4.5h14a1 1 0 0 1 1 1V10a2.5 2.5 0 0 0 0 5v3.5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V15a2.5 2.5 0 0 0 0-5V5.5a1 1 0 0 1 1-1Z',
  Health: 'M12 20.5S4 15.5 4 9.9A4.4 4.4 0 0 1 12 7a4.4 4.4 0 0 1 8 2.9c0 5.6-8 10.6-8 10.6Z',
  Other: 'M5 12h.01M12 12h.01M19 12h.01',
  Salary: 'M12 3v18M17 6.5c-.8-1-2.6-1.5-5-1.5-3 0-5 1.4-5 3.3 0 4.8 10 2.6 10 6.4 0 1.9-2 3.3-5 3.3-2.4 0-4.2-.6-5-1.6',
  Freelance: 'M8 6l-5 6 5 6M16 6l5 6-5 6',
  Investments: 'M4 19V5M4 19h16M7 15.5l3.5-4 3 2.5L18 8M18 8h-3.2M18 8v3.2',
  'Other Income': 'M12 3v18M17 6.5c-.8-1-2.6-1.5-5-1.5-3 0-5 1.4-5 3.3 0 4.8 10 2.6 10 6.4 0 1.9-2 3.3-5 3.3-2.4 0-4.2-.6-5-1.6',
}

export const fmtRs = (n) => {
  const v = Math.round(Number(n) || 0)
  const sign = v < 0 ? '-' : ''
  return `${sign}Rs ${Math.abs(v).toLocaleString('en-PK')}`
}

export const fmtRsShort = (n) => {
  const v = Number(n) || 0
  if (Math.abs(v) >= 100000) return `Rs ${(v / 100000).toFixed(1)}L`
  if (Math.abs(v) >= 1000) return `Rs ${(v / 1000).toFixed(1)}k`
  return fmtRs(v)
}

export const monthKey = (d) => {
  const dt = typeof d === 'string' ? new Date(d) : d
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}`
}

export const monthLabel = (key) => {
  const [y, m] = key.split('-').map(Number)
  return new Date(y, m - 1, 1).toLocaleDateString('en-GB', { month: 'short' })
}

export const currentMonthKey = () => monthKey(new Date())

export function lastNMonthKeys(n) {
  const keys = []
  const now = new Date()
  for (let i = n - 1; i >= 0; i--) {
    keys.push(monthKey(new Date(now.getFullYear(), now.getMonth() - i, 1)))
  }
  return keys
}

export const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
