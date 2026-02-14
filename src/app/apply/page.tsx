'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function ApplyPage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    company_name: '', industry: '', years_in_business: '',
    annual_revenue: '', amount_requested: '', loan_purpose: '',
  })

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // In demo mode or when Supabase isn't configured, just simulate
    await new Promise(r => setTimeout(r, 1500))
    setSubmitted(true)
    setLoading(false)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-100">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">✓</span>
          </div>
          <h1 className="text-2xl font-bold text-navy-950 mb-3">Application Received!</h1>
          <p className="text-gray-500 mb-6 leading-relaxed">
            Thank you, {form.name.split(' ')[0]}. We&apos;ll review your application and email you portal access within 24 hours.
          </p>
          <Link href="/" className="text-navy-700 text-sm font-medium hover:text-navy-900">
            ← Back to Home
          </Link>
        </div>
      </div>
    )
  }

  const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-navy-200 focus:border-navy-400 transition-colors bg-white"
  const labelClass = "block text-sm font-medium text-gray-700 mb-1.5"

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-navy-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CS</span>
            </div>
            <span className="font-semibold text-navy-900">Credit Simplicity</span>
          </Link>
          <span className="text-xs text-gray-400">🔒 Secure Application</span>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-navy-950 mb-3">Start Your Application</h1>
          <p className="text-gray-500">Takes about 5 minutes. No credit pull, no obligation.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Contact */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100">
            <h2 className="text-lg font-semibold text-navy-950 mb-5">Contact Information</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className={labelClass}>Full Name *</label>
                <input type="text" required value={form.name} onChange={update('name')} placeholder="John Smith" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Email *</label>
                <input type="email" required value={form.email} onChange={update('email')} placeholder="john@company.com" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Phone *</label>
                <input type="tel" required value={form.phone} onChange={update('phone')} placeholder="(555) 123-4567" className={inputClass} />
              </div>
            </div>
          </div>

          {/* Company */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100">
            <h2 className="text-lg font-semibold text-navy-950 mb-5">Company Details</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className={labelClass}>Company Name *</label>
                <input type="text" required value={form.company_name} onChange={update('company_name')} placeholder="Acme Manufacturing LLC" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Industry *</label>
                <select required value={form.industry} onChange={update('industry')} className={inputClass}>
                  <option value="">Select industry</option>
                  {['Manufacturing', 'Construction', 'Healthcare', 'Technology', 'Retail', 'Transportation', 'Professional Services', 'Food & Beverage', 'Real Estate', 'Other'].map(i => (
                    <option key={i} value={i}>{i}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Years in Business *</label>
                <select required value={form.years_in_business} onChange={update('years_in_business')} className={inputClass}>
                  <option value="">Select</option>
                  {['Less than 2', '2-5', '5-10', '10-20', '20+'].map(y => (
                    <option key={y} value={y}>{y} years</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Financials */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100">
            <h2 className="text-lg font-semibold text-navy-950 mb-5">Loan Details</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Annual Revenue *</label>
                <select required value={form.annual_revenue} onChange={update('annual_revenue')} className={inputClass}>
                  <option value="">Select range</option>
                  {['Under $500K', '$500K - $1M', '$1M - $2M', '$2M - $5M', '$5M - $10M', '$10M - $25M', '$25M+'].map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Loan Amount Requested *</label>
                <select required value={form.amount_requested} onChange={update('amount_requested')} className={inputClass}>
                  <option value="">Select range</option>
                  {['$100K - $250K', '$250K - $500K', '$500K - $1M', '$1M - $2.5M', '$2.5M - $5M', '$5M - $10M', '$10M+'].map(a => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Loan Purpose *</label>
                <textarea required value={form.loan_purpose} onChange={update('loan_purpose')} placeholder="Equipment purchase, working capital, expansion, refinancing..." rows={3} className={inputClass} />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-navy-900 text-white py-4 rounded-xl font-medium hover:bg-navy-800 transition-all disabled:opacity-60 disabled:cursor-not-allowed text-base"
          >
            {loading ? 'Submitting...' : 'Submit Application →'}
          </button>
          <p className="text-xs text-gray-400 text-center">
            By submitting, you agree to our Terms of Service and Privacy Policy. No credit pull at this stage.
          </p>
        </form>
      </div>
    </div>
  )
}
