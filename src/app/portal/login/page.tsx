'use client'

import Link from 'next/link'
import { useState } from 'react'
import { supabase, isDemoMode } from '@/lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (isDemoMode || !supabase) {
      // Demo mode — just pretend
      await new Promise(r => setTimeout(r, 1000))
      setSent(true)
      setLoading(false)
      return
    }

    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/portal` },
    })

    if (authError) {
      setError(authError.message)
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-100">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">✉️</span>
          </div>
          <h1 className="text-2xl font-bold text-navy-950 mb-3">Check Your Email</h1>
          <p className="text-gray-500 mb-6 leading-relaxed">
            We sent a magic link to <strong>{email}</strong>. Click the link to access your portal.
          </p>
          {isDemoMode && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
              <p className="text-yellow-800 text-sm">
                <strong>Demo Mode:</strong> Supabase isn&apos;t configured. 
                <Link href="/portal" className="underline ml-1">Go to portal demo →</Link>
              </p>
            </div>
          )}
          <button onClick={() => setSent(false)} className="text-navy-700 text-sm font-medium hover:text-navy-900">
            ← Try a different email
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white rounded-2xl p-10 shadow-sm border border-gray-100">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-navy-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CS</span>
            </div>
            <span className="font-semibold text-navy-900">Credit Simplicity</span>
          </Link>
          <h1 className="text-2xl font-bold text-navy-950 mb-2">Borrower Portal</h1>
          <p className="text-gray-500 text-sm">Sign in to track your loan application</p>
        </div>

        {isDemoMode && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
            <p className="text-yellow-800 text-sm">
              <strong>Demo Mode:</strong> Supabase isn&apos;t configured yet.
              <Link href="/portal" className="underline ml-1">View portal demo →</Link>
            </p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-navy-200 focus:border-navy-400 transition-colors"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-navy-900 text-white py-3 rounded-xl font-medium hover:bg-navy-800 transition-all disabled:opacity-60"
          >
            {loading ? 'Sending...' : 'Send Magic Link'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          Don&apos;t have an account? <Link href="/apply" className="text-navy-700 hover:text-navy-900">Apply here</Link>
        </p>
      </div>
    </div>
  )
}
