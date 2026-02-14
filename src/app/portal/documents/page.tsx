'use client'

import { useState } from 'react'
import { mockDocuments } from '@/lib/mock-data'

const statusColors = {
  not_started: 'bg-gray-100 text-gray-500',
  uploaded: 'bg-blue-50 text-blue-600',
  under_review: 'bg-yellow-50 text-yellow-700',
  approved: 'bg-green-50 text-green-600',
}

const statusLabels = {
  not_started: 'Not Started',
  uploaded: 'Uploaded',
  under_review: 'Under Review',
  approved: 'Approved',
}

export default function DocumentsPage() {
  const [docs] = useState(mockDocuments)
  const [dragOver, setDragOver] = useState<string | null>(null)

  const completed = docs.filter(d => d.status !== 'not_started').length
  const total = docs.length
  const pct = Math.round((completed / total) * 100)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-950">Documents</h1>
        <p className="text-gray-500 text-sm mt-1">Upload required documents for your loan application</p>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-navy-900">Needs List Progress</span>
          <span className="text-sm font-bold text-navy-900">{pct}%</span>
        </div>
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-navy-900 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
        <p className="text-xs text-gray-400 mt-2">{completed} of {total} documents submitted</p>
      </div>

      {/* Document List */}
      <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50">
        {docs.map((doc) => (
          <div
            key={doc.id}
            className={`p-5 flex items-center justify-between gap-4 transition-colors ${dragOver === doc.id ? 'bg-navy-50' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(doc.id) }}
            onDragLeave={() => setDragOver(null)}
            onDrop={(e) => { e.preventDefault(); setDragOver(null); /* handle upload */ }}
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-lg">{doc.status === 'approved' ? '✅' : doc.status === 'not_started' ? '📎' : '📄'}</span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-navy-900 truncate">{doc.category}</p>
                {doc.filename && <p className="text-xs text-gray-400 truncate">{doc.filename}</p>}
              </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[doc.status]}`}>
                {statusLabels[doc.status]}
              </span>
              {doc.status === 'not_started' && (
                <label className="cursor-pointer bg-navy-900 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-navy-800 transition-colors">
                  Upload
                  <input type="file" className="hidden" onChange={() => {/* handle */}} />
                </label>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Drop zone hint */}
      <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center">
        <p className="text-gray-400 text-sm">Drag and drop files here, or use the upload buttons above</p>
        <p className="text-gray-300 text-xs mt-1">PDF, XLSX, DOC up to 25MB</p>
      </div>
    </div>
  )
}
