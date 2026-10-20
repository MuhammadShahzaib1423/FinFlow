import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { FinanceProvider } from './lib/store'
import Sidebar from './components/Sidebar'
import ScrollToTop from './components/ScrollToTop'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Budget from './pages/Budget'
import Goals from './pages/Goals'
import About from './pages/About'

export default function App() {
  return (
    <FinanceProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="min-h-screen bg-ivory-100 font-body text-pine-950">
          <Sidebar />
          <main className="lg:pl-64">
            <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/budget" element={<Budget />} />
                <Route path="/goals" element={<Goals />} />
                <Route path="/about" element={<About />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              <footer className="mt-12 border-t border-pine-900/10 pt-5 pb-2 text-center text-xs text-pine-900/40">
                FinFlow — a fictional-data demo dashboard. Built with React, Tailwind CSS, Framer Motion & Recharts.
              </footer>
            </div>
          </main>
        </div>
      </BrowserRouter>
    </FinanceProvider>
  )
}
