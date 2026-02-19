'use client'

import { useState, useEffect } from 'react'
import { getPortalData } from '@/lib/portal-data'

export default function MeetingsPage() {
  const [showScheduler, setShowScheduler] = useState(false)
  const [meetings, setMeetings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPortalData().then(data => {
      setMeetings(data?.meetings || [])
      setLoading(false)
    })
  }, [])

  if (loading) return <div className="flex items-center justify-center py-20"><div className="text-gray-400">Loading...</div></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-950">Meetings</h1>
          <p className="text-gray-500 text-sm mt-1">Schedule and view your meetings</p>
        </div>
        <button
          onClick={() => setShowScheduler(!showScheduler)}
          className="bg-navy-900 text-white text-sm px-5 py-2.5 rounded-xl font-medium hover:bg-navy-800 transition-colors"
        >
          Schedule Meeting
        </button>
      </div>

      {/* Scheduler placeholder */}
      {showScheduler && (
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
          <div className="w-16 h-16 bg-navy-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📅</span>
          </div>
          <h3 className="font-semibold text-navy-950 mb-2">Meeting Scheduler</h3>
          <p className="text-gray-500 text-sm mb-4 max-w-sm mx-auto">
            Calendly or Microsoft Teams scheduling will be embedded here. For now, your analyst will coordinate meeting times via email.
          </p>
          <button
            onClick={() => setShowScheduler(false)}
            className="text-sm text-gray-400 hover:text-gray-600"
          >
            Close
          </button>
        </div>
      )}

      {/* Meeting list */}
      {meetings.length > 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50">
          {meetings.map((meeting) => {
            const date = new Date(meeting.scheduled_at)
            const isPast = meeting.status === 'completed'
            return (
              <div key={meeting.id} className="p-5 flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center flex-shrink-0 ${isPast ? 'bg-gray-50' : 'bg-navy-50'}`}>
                  <span className="text-[10px] font-semibold text-gray-400 uppercase">
                    {date.toLocaleDateString('en-US', { month: 'short' })}
                  </span>
                  <span className={`text-lg font-bold ${isPast ? 'text-gray-400' : 'text-navy-900'}`}>
                    {date.getDate()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-navy-900">{meeting.meeting_type}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      isPast ? 'bg-gray-100 text-gray-500' : 'bg-green-50 text-green-600'
                    }`}>
                      {meeting.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mb-1">
                    {date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at{' '}
                    {date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                  </p>
                  {meeting.notes && <p className="text-sm text-gray-500 mt-2">{meeting.notes}</p>}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <p className="text-gray-400">No meetings scheduled yet</p>
        </div>
      )}
    </div>
  )
}
