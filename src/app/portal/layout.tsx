'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/portal', label: 'Dashboard', icon: '📊' },
  { href: '/portal/documents', label: 'Documents', icon: '📄' },
  { href: '/portal/meetings', label: 'Meetings', icon: '📅' },
  { href: '/portal/loan', label: 'Loan Details', icon: '💰' },
]

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="bg-navy-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-white/10 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">CS</span>
            </div>
            <span className="font-semibold text-sm">Credit Simplicity</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-xs text-navy-200 hidden sm:block">Demo Mode</span>
            <div className="w-8 h-8 bg-navy-700 rounded-full flex items-center justify-center text-xs font-medium">JS</div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <aside className="lg:w-56 flex-shrink-0">
          <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
            {navItems.map(item => {
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                    active ? 'bg-white text-navy-900 shadow-sm' : 'text-gray-500 hover:bg-white/60 hover:text-gray-700'
                  }`}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  )
}
