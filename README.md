# FinFlow — Personal Finance Dashboard

A calm, clear personal finance dashboard: track income and expenses, keep monthly category budgets honest, and watch savings goals grow — all in one view.

**Live demo:** https://finflow-muhammad-shahzaibs-projects-16858ef3.vercel.app

## Features

- **Dashboard** — animated total balance, monthly income, monthly expenses and savings-rate cards; a spending-by-category donut chart; an income-vs-expenses area chart for the last six months; recent activity; and a savings-goal spotlight.
- **Transactions** — a full ledger with search, category and type filters, live income/expense/net totals for the filtered view, and add / edit / delete through a validated modal form.
- **Budget** — monthly limits for Housing, Food, Transport, Shopping, Entertainment, Health and Other, measured automatically against real spending, with animated progress bars, "near limit" and "over budget" highlighting, and editable limits.
- **Savings goals** — named goals with targets, deadlines and progress bars; create goals and add contributions at any time.
- **Persistent demo data** — everything is stored in the browser's local storage, seeded on first run with six months of fictional transactions, with a one-click reset on the About page.
- Fully responsive: a dark sidebar on desktop that collapses into a slide-in drawer on mobile.

## Tech stack

- React 18 + Vite
- Tailwind CSS
- Framer Motion (animated counters, progress bars, modals, page transitions)
- Recharts (donut + area charts)
- React Router
- localStorage for persistence — no backend, no sign-up, no tracking

## Run locally

```bash
npm install
npm run dev
```

## Notes

All people, figures and transactions in FinFlow are fictional demo data created for portfolio purposes. Currency is formatted in Pakistani Rupees (Rs).

Built by **Muhammad Shahzaib** — Full Stack Developer (React · Next.js · Node.js · Laravel).
Portfolio: https://shahzaib-portfolio-muhammad-shahzaibs-projects-16858ef3.vercel.app · GitHub: https://github.com/MuhammadShahzaib1423
