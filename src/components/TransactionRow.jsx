import { CATEGORY_COLORS, CATEGORY_ICONS, fmtDate, fmtRs } from '../lib/finance'
import Icon from './Icon'

export default function TransactionRow({ tx, actions }) {
  const colour = CATEGORY_COLORS[tx.category] || '#8a938e'
  return (
    <div className="flex items-center gap-3 px-4 py-3 transition hover:bg-ivory-100/70 sm:px-5">
      <span className="grid w-10 h-10 shrink-0 place-items-center rounded-xl" style={{ backgroundColor: `${colour}1f`, color: colour }}>
        <Icon d={CATEGORY_ICONS[tx.category] || CATEGORY_ICONS.Other} className="w-5 h-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-pine-950">{tx.title}</p>
        <p className="text-xs text-pine-900/50">{tx.category} · {fmtDate(tx.date)}</p>
      </div>
      <span className={`font-display text-sm font-bold ${tx.type === 'income' ? 'text-mint-600' : 'text-pine-950'}`}>
        {tx.type === 'income' ? '+' : '−'}{fmtRs(tx.amount)}
      </span>
      {actions && (
        <span className="flex shrink-0 gap-1">
          <button onClick={() => actions.onEdit(tx)} aria-label="Edit" className="rounded-lg p-2 text-pine-900/40 hover:bg-pine-900/5 hover:text-pine-900">
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16.5 4.5l3 3L8 19H5v-3L16.5 4.5Z" /></svg>
          </button>
          <button onClick={() => actions.onDelete(tx)} aria-label="Delete" className="rounded-lg p-2 text-pine-900/40 hover:bg-rose-50 hover:text-rose-600">
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6.5 7l1 13h9l1-13" /></svg>
          </button>
        </span>
      )}
    </div>
  )
}
