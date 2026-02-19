'use client'

import { useEffect, useState } from 'react'
import { getPortalData } from '@/lib/portal-data'
import { statusSteps, type LoanStatus } from '@/lib/mock-data'

export default function PortalDashboard() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPortalData().then(d => { setData(d); setLoading(false) })
  }, [])

  if (loading) return <div className="flex items-center justify-center py-20"><div className="text-gray-400">Loading...</div></div>
  if (!data) return <div className="text-center py-20 text-gray-500">Unable to load data. Please log in.</div>

  const { borrower, loan, documents } = data
  const currentStatus: LoanStatus = loan?.status || 'applied'
  const currentIdx = statusSteps.findIndex(s => s.key === currentStatus)
  const docsUploaded = documents?.filter((d: any) => d.status !== 'not_started').length || 0
  const docsTotal = documents?.length || 0
  const nextMeeting = data.meetings?.find((m: any) => m.status === 'scheduled')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-950">Welcome back, {borrower?.name?.split(' ')[0] || 'there'}</h1>
        <p className="text-gray-500 text-sm mt-1">{borrower?.company_name}</p>
        {data.isDemo && <p className="text-xs text-yellow-600 mt-1">📋 Demo Mode — showing sample data</p>}
      </div>

      {/* Status Timeline */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100">
        <h2 className="text-lg font-semibold text-navy-950 mb-6">Application Progress</h2>
        <div className="flex items-center justify-between overflow-x-auto pb-2">
          {statusSteps.map((step, idx) => {
            const done = idx < currentIdx
            const active = idx === currentIdx
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
          <div className="text-2xl font-bold text-navy-950">{loan?.amount_requested || 'N/A'}</div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="text-sm text-gray-500 mb-1">Documents</div>
          <div className="text-2xl font-bold text-navy-950">{docsUploaded} / {docsTotal}</div>
          <div className="text-xs text-gray-400 mt-1">uploaded</div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="text-sm text-gray-500 mb-1">Next Meeting</div>
          {nextMeeting ? (
            <>
              <div className="text-lg font-bold text-navy-950">
                {new Date(nextMeeting.scheduled_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
              <div className="text-xs text-gray-400 mt-1">{nextMeeting.meeting_type}</div>
            </>
          ) : (
            <div className="text-lg font-bold text-gray-300">None scheduled</div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100">
        <h2 className="text-lg font-semibold text-navy-950 mb-4">Recent Messages</h2>
        <div className="space-y-4">
          {(data.messages || []).slice(-4).reverse().map((msg: any, i: number) => (
            <div key={msg.id || i} className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0 bg-navy-300" />
              <div>
                <p className="text-sm text-gray-700">{msg.message}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {msg.from_name || msg.from} · {new Date(msg.created_at || msg.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
              </div>
            </div>
          ))}
          {(!data.messages || data.messages.length === 0) && (
            <p className="text-gray-400 text-sm">No messages yet</p>
          )}
        </div>
      </div>
    </div>
  )
}
