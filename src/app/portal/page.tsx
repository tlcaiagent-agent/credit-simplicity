'use client'

import { mockLoanApplication, mockBorrower, statusSteps, type LoanStatus } from '@/lib/mock-data'

export default function PortalDashboard() {
  const currentStatus = mockLoanApplication.status
  const currentIdx = statusSteps.findIndex(s => s.key === currentStatus)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-950">Welcome back, {mockBorrower.name.split(' ')[0]}</h1>
        <p className="text-gray-500 text-sm mt-1">{mockBorrower.company_name}</p>
      </div>

      {/* Status Timeline */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100">
        <h2 className="text-lg font-semibold text-navy-950 mb-6">Application Progress</h2>
        <div className="flex items-center justify-between overflow-x-auto pb-2">
          {statusSteps.map((step, idx) => {
            const done = idx < currentIdx
            const active = idx === currentIdx
            const future = idx > currentIdx
            return (
              <div key={step.key} className="flex items-center flex-1 min-w-0 last:flex-none">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    done ? 'bg-green-500 text-white' :
                    active ? 'bg-navy-900 text-white ring-4 ring-navy-100' :
                    'bg-gray-200 text-gray-400'
                  }`}>
                    {done ? '✓' : idx + 1}
                  </div>
                  <span className={`text-[11px] mt-2 text-center whitespace-nowrap ${
                    active ? 'font-semibold text-navy-900' : done ? 'text-green-600' : 'text-gray-400'
                  }`}>
                    {step.label}
                  </span>
                </div>
                {idx < statusSteps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 mt-[-16px] min-w-[20px] ${done ? 'bg-green-400' : 'bg-gray-200'}`} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="text-sm text-gray-500 mb-1">Loan Amount</div>
          <div className="text-2xl font-bold text-navy-950">${(mockLoanApplication.amount_requested / 1000).toFixed(0)}K</div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="text-sm text-gray-500 mb-1">Documents</div>
          <div className="text-2xl font-bold text-navy-950">4 / 10</div>
          <div className="text-xs text-gray-400 mt-1">uploaded</div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="text-sm text-gray-500 mb-1">Next Meeting</div>
          <div className="text-lg font-bold text-navy-950">Jan 25</div>
          <div className="text-xs text-gray-400 mt-1">Document Review</div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100">
        <h2 className="text-lg font-semibold text-navy-950 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[
            { date: 'Jan 20', text: 'Needs list sent — 10 documents requested', type: 'info' },
            { date: 'Jan 18', text: 'Initial meeting completed with Sarah Chen', type: 'success' },
            { date: 'Jan 16', text: 'Analyst assigned: Sarah Chen', type: 'info' },
            { date: 'Jan 15', text: 'Application submitted', type: 'success' },
          ].map((a, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${a.type === 'success' ? 'bg-green-400' : 'bg-navy-300'}`} />
              <div>
                <p className="text-sm text-gray-700">{a.text}</p>
                <p className="text-xs text-gray-400 mt-0.5">{a.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
