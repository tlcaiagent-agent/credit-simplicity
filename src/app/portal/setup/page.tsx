'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, isDemoMode } from '@/lib/supabase'

export default function AccountSetupPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [userInfo, setUserInfo] = useState<{ name?: string; company_name?: string; email?: string }>({})

  useEffect(() => {
    const setupSession = async () => {
      if (isDemoMode || !supabase) {
        // Demo mode - show setup form with mock data
        setUserInfo({
          name: 'Demo User',
          company_name: 'Demo Company',
          email: 'demo@example.com'
        })
        setLoading(false)
        return
      }

      try {
        // Extract tokens from URL hash
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const accessToken = hashParams.get('access_token')
        const refreshToken = hashParams.get('refresh_token')
        const type = hashParams.get('type')

        if (type === 'invite' && accessToken && refreshToken) {
          // Set the session using the tokens from the invite link
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          })

          if (error) {
            console.error('Session setup error:', error)
            setError('Invalid or expired invite link. Please request a new one.')
            setLoading(false)
            return
          }

          if (data.user) {
            // Extract user info from metadata
            setUserInfo({
              name: data.user.user_metadata?.name || '',
              company_name: data.user.user_metadata?.company_name || '',
              email: data.user.email || ''
            })
          }
        } else {
          // No valid invite tokens found
          setError('Invalid invite link. Please check your email for the correct setup link.')
        }
      } catch (err) {
        console.error('Setup error:', err)
        setError('Something went wrong. Please try again or request a new invite link.')
      }
      
      setLoading(false)
    }

    setupSession()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setSubmitting(true)

    try {
      if (isDemoMode || !supabase) {
        // Demo mode - just redirect after a brief delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        router.push('/portal')
        return
      }

      // Update user password
      const { error } = await supabase.auth.updateUser({
        password: password
      })

      if (error) {
        console.error('Password update error:', error)
        setError('Failed to set password. Please try again.')
        setSubmitting(false)
        return
      }

      // Success - redirect to portal
      router.push('/portal')
    } catch (err) {
      console.error('Submit error:', err)
      setError('Something went wrong. Please try again.')
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400">Setting up your account...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="bg-white rounded-2xl shadow-sm p-8 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-navy-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CS</span>
            </div>
            <span className="font-semibold text-lg text-navy-900">Credit Simplicity</span>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Set Up Your Account</h1>
          <p className="text-gray-600 text-sm">
            Welcome{userInfo.name ? `, ${userInfo.name.split(' ')[0]}` : ''}! Complete your account setup to access your loan portal.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Pre-filled info display */}
        {(userInfo.name || userInfo.company_name || userInfo.email) && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-gray-900 text-sm mb-2">Account Information</h3>
            {userInfo.name && (
              <div className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Name:</span> {userInfo.name}
              </div>
            )}
            {userInfo.company_name && (
              <div className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Company:</span> {userInfo.company_name}
              </div>
            )}
            {userInfo.email && (
              <div className="text-sm text-gray-600">
                <span className="font-medium">Email:</span> {userInfo.email}
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Choose a Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-navy-900 focus:border-transparent"
                placeholder="Enter your password"
                required
                minLength={6}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-navy-900 focus:border-transparent"
                placeholder="Confirm your password"
                required
                minLength={6}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-navy-900 text-white py-3 px-4 rounded-xl font-medium hover:bg-navy-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            {submitting ? 'Setting up...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            By creating your account, you agree to our terms of service and privacy policy.
          </p>
        </div>
      </div>
    </div>
  )
}