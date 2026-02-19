'use client'

import { useEffect, useState } from 'react'
import { getPortalData } from '@/lib/portal-data'

export default function LoanDetailsPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPortalData().then(d => { setData(d); setLoading(false) })
  }, [])

  if (loading) return <div className="flex items-center justify-center py-20"><div className="text-gray-400">Loading...</div></div>
  if (!data) return <div className="text-center py-20 text-gray-500">Unable to load data.</div>

  const { borrower, loan, messages } = data

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-950">Loan Details</h1>
        <p className="text-gray-500 text-sm mt-1">Your loan application summary and updates</p>
      </div>

      {/* Loan Summary */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100">
        <h2 className="text-lg font-semibold text-navy-950 mb-5">Application Summary</h2>
        <div className="grid sm:grid-cols-2 gap-y-4 gap-x-8">
          {[
            ['Company', borrower?.company_name || 'N/A'],
            ['Industry', borrower?.industry || 'N/A'],
            ['Years in Business', borrower?.years_in_business ? `${borrower.years_in_business} years` : 'N/A'],
            ['Annual Revenue', borrower?.annual_revenue || 'N/A'],
            ['Amount Requested', loan?.amount_requested || 'N/A'],
            ['Purpose', loan?.loan_purpose || 'N/A'],
            ['Status', (loan?.status || 'applied').replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())],
            ['Applied', loan?.created_at ? new Date(loan.created_at).toLocaleDateString() : 'N/A'],
          ].map(([label, value]) => (
            <div key={label}>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">{label}</p>
              <p className="text-sm font-medium text-navy-900">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100">
        <h2 className="text-lg font-semibold text-navy-950 mb-5">Messages & Updates</h2>
        <div className="space-y-4">
          {(messages || []).map((msg: any) => (
            <div key={msg.id} className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-navy-900">{msg.from_name || msg.from}</span>
                <span className="text-xs text-gray-400">
                  {new Date(msg.created_at || msg.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{msg.message}</p>
            </div>
          ))}
          {(!messages || messages.length === 0) && (
            <p className="text-gray-400 text-sm">No messages yet</p>
          )}
        </div>
      </div>
    </div>
  )
}
