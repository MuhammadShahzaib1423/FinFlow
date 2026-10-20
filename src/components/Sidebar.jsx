import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Icon from './Icon'

const LINKS = [
  { to: '/', label: 'Dashboard', d: 'M4 4h7v7H4zM13 4h7v4h-7zM13 10h7v10h-7zM4 13h7v7H4z' },
  { to: '/transactions', label: 'Transactions', d: 'M7 4L3.5 7.5 7 11M3.5 7.5H20M17 13l3.5 3.5L17 20M20.5 16.5H4' },
  { to: '/budget', label: 'Budget', d: 'M12 3a9 9 0 1 0 9 9h-9V3ZM17.5 2.5A9 9 0 0 1 21.5 8H17z' },
  { to: '/goals', label: 'Savings goals', d: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10ZM12 13.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z' },
  { to: '/about', label: 'About', d: 'M12 11v6M12 7.5h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z' },
]

function NavItems({ onNavigate }) {
  return LINKS.map((l) => (
    <NavLink
      key={l.to}
      to={l.to}
      end={l.to === '/'}
      onClick={onNavigate}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
          isActive ? 'bg-mint-500/15 text-mint-300' : 'text-emerald-100/60 hover:bg-white/5 hover:text-white'
        }`
      }
    >
      <Icon d={l.d} className="w-5 h-5 shrink-0" />
      {l.label}
    </NavLink>
  ))
}

export default function Sidebar() {
  const [open, setOpen] = useState(false)
  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden sticky top-0 z-40 flex items-center justify-between bg-pine-950 px-4 py-3 text-white">
        <Link to="/" className="flex items-center gap-2 font-display font-bold">
          <span className="grid w-8 h-8 place-items-center rounded-lg bg-mint-500/20 text-mint-300">
            <Icon d="M8 22 L13 14 L18 18 L24 9" className="w-4 h-4 hidden" />
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 17l4-6 3.5 3L18 7" /></svg>
          </span>
          FinFlow
        </Link>
        <button onClick={() => setOpen(true)} aria-label="Open menu" className="rounded-lg p-2 hover:bg-white/10">
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div className="fixed inset-0 z-50 bg-black/50 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 w-64 bg-pine-950 p-5 lg:hidden"
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: 'tween', duration: 0.22 }}
            >
              <div className="mb-6 flex items-center justify-between">
                <span className="font-display text-lg font-bold text-white">FinFlow</span>
                <button onClick={() => setOpen(false)} aria-label="Close menu" className="rounded-lg p-2 text-white/70 hover:bg-white/10">
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
                </button>
              </div>
              <nav className="space-y-1.5"><NavItems onNavigate={() => setOpen(false)} /></nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-pine-950 lg:flex">
        <div className="px-6 pt-7 pb-8">
          <Link to="/" className="flex items-center gap-3">
            <span className="grid w-10 h-10 place-items-center rounded-xl bg-mint-500/20 text-mint-300">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 17l4-6 3.5 3L18 7" /><circle cx="18" cy="7" r="1.6" fill="#e3b94e" stroke="none" /></svg>
            </span>
            <span>
              <span className="block font-display text-lg font-bold leading-tight text-white">FinFlow</span>
              <span className="block text-[11px] uppercase tracking-widest text-emerald-100/40">Personal finance</span>
            </span>
          </Link>
        </div>
        <nav className="flex-1 space-y-1.5 px-4"><NavItems /></nav>
        <div className="p-4">
          <div className="rounded-2xl bg-white/5 p-4">
            <div className="flex items-center gap-3">
              <span className="grid w-10 h-10 shrink-0 place-items-center rounded-full bg-mint-500 font-display text-sm font-bold text-pine-950">AR</span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">Ahmad Raza</p>
                <p className="truncate text-xs text-emerald-100/50">Demo account · Lahore</p>
              </div>
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-emerald-100/40">All figures are fictional demo data, saved only in this browser.</p>
          </div>
        </div>
      </aside>
    </>
  )
}
