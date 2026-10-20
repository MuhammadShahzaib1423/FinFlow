import { useFinance } from '../lib/store'
import PageHeader from '../components/PageHeader'

export default function About() {
  const { resetDemo } = useFinance()
  return (
    <div className="max-w-3xl">
      <PageHeader
        eyebrow="About FinFlow"
        title="Money, made calm"
        sub="FinFlow is a personal finance dashboard built to make everyday money decisions feel clear rather than stressful."
      />
      <div className="space-y-4">
        <section className="rounded-3xl bg-white p-6 shadow-card">
          <h2 className="font-display text-base font-bold text-pine-950">What it does</h2>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-pine-900/65">
            <li>A dashboard with animated balance, income, expense and savings-rate cards, plus category and six-month trend charts.</li>
            <li>A full transaction ledger with search, filters, and add / edit / delete — all validated.</li>
            <li>Monthly category budgets that measure themselves against your real spending and flag anything over budget.</li>
            <li>Savings goals with progress tracking and quick contributions.</li>
          </ul>
        </section>
        <section className="rounded-3xl bg-white p-6 shadow-card">
          <h2 className="font-display text-base font-bold text-pine-950">Your data</h2>
          <p className="mt-3 text-sm leading-relaxed text-pine-900/65">
            FinFlow runs entirely in your browser. The demo ledger belongs to a fictional account holder, and every
            change you make is stored only in this browser's local storage — nothing is uploaded anywhere. Clearing
            your browser storage, or using the button below, restores the original demo data.
          </p>
          <button
            onClick={() => { if (window.confirm('Reset all FinFlow data back to the original demo figures?')) resetDemo() }}
            className="mt-4 rounded-xl bg-pine-900/5 px-4 py-2.5 text-sm font-semibold text-pine-900 transition hover:bg-pine-900/10"
          >
            Reset demo data
          </button>
        </section>
        <section className="rounded-3xl bg-pine-900 p-6 text-white shadow-card">
          <h2 className="font-display text-base font-bold">Built by Muhammad Shahzaib</h2>
          <p className="mt-2 text-sm leading-relaxed text-emerald-100/65">
            A portfolio project by a Full Stack Developer based in Rawalpindi, Pakistan — React 18, Vite,
            Tailwind CSS, Framer Motion and Recharts.
          </p>
          <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm font-semibold">
            <a className="text-mint-300 hover:text-mint-400" href="https://shahzaib-portfolio-muhammad-shahzaibs-projects-16858ef3.vercel.app" target="_blank" rel="noreferrer">Portfolio ↗</a>
            <a className="text-mint-300 hover:text-mint-400" href="https://github.com/MuhammadShahzaib1423" target="_blank" rel="noreferrer">GitHub ↗</a>
          </p>
        </section>
      </div>
    </div>
  )
}
