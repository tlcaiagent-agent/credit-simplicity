'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase, isDemoMode } from '@/lib/supabase'

const navItems = [
  { href: '/portal', label: 'Dashboard', icon: '📊' },
  { href: '/portal/documents', label: 'Documents', icon: '📄' },
  { href: '/portal/meetings', label: 'Meetings', icon: '📅' },
  { href: '/portal/loan', label: 'Loan Details', icon: '💰' },
]

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (isDemoMode || !supabase) {
      setChecked(true)
      return
    }
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user && pathname !== '/portal/login') {
        router.push('/portal/login')
      } else {
        setUser(data.user)
      }
      setChecked(true)
    })
  }, [pathname, router])

  // Don't wrap login page in portal layout
  if (pathname === '/portal/login') return <>{children}</>

  if (!checked) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-gray-400">Loading...</div></div>

  const initials = user?.user_metadata?.name
    ? user.user_metadata.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : isDemoMode ? 'DM' : '??'

  const handleLogout = async () => {
    if (supabase) await supabase.auth.signOut()
    router.push('/portal/login')
  }

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
            {isDemoMode && <span className="text-xs text-navy-200 hidden sm:block">Demo Mode</span>}
            <button onClick={handleLogout} className="text-xs text-navy-300 hover:text-white transition-colors">
              Sign Out
            </button>
            <div className="w-8 h-8 bg-navy-700 rounded-full flex items-center justify-center text-xs font-medium">{initials}</div>
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
