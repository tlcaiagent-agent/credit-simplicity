'use client'

import { mockLoanApplication, mockBorrower, mockMessages } from '@/lib/mock-data'

export default function LoanDetailsPage() {
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
            ['Company', mockBorrower.company_name],
            ['Industry', mockBorrower.industry],
            ['Years in Business', `${mockBorrower.years_in_business} years`],
            ['Annual Revenue', mockBorrower.annual_revenue],
            ['Amount Requested', `$${(mockLoanApplication.amount_requested).toLocaleString()}`],
            ['Purpose', mockLoanApplication.loan_purpose],
            ['Status', mockLoanApplication.status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())],
            ['Applied', new Date(mockLoanApplication.created_at).toLocaleDateString()],
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
          {mockMessages.map((msg) => (
            <div key={msg.id} className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-navy-900">{msg.from}</span>
                <span className="text-xs text-gray-400">
                  {new Date(msg.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{msg.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
