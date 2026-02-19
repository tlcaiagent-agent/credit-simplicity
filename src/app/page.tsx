'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-sm border-b border-gray-100 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-navy-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CS</span>
            </div>
            <span className="font-semibold text-navy-900 text-lg">Credit Simplicity</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#how-it-works" className="text-sm text-gray-600 hover:text-navy-900 hidden sm:block">How It Works</a>
            <a href="#benefits" className="text-sm text-gray-600 hover:text-navy-900 hidden sm:block">Benefits</a>
            <Link href="/portal/login" className="text-sm text-gray-600 hover:text-navy-900">Portal Login</Link>
            <Link href="/apply" className="bg-navy-900 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-navy-800 transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block bg-navy-50 text-navy-700 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
            Trusted by 200+ small businesses
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-navy-950 leading-tight mb-6">
            Simplify Your<br />Business Lending
          </h1>
          <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Apply once. We underwrite your deal and let banks compete for your business. 
            Better terms, total transparency, zero hassle.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/apply" className="bg-navy-900 text-white px-8 py-3.5 rounded-xl text-base font-medium hover:bg-navy-800 transition-all hover:shadow-lg">
              Get Started →
            </Link>
            <a href="#how-it-works" className="border border-gray-200 text-gray-700 px-8 py-3.5 rounded-xl text-base font-medium hover:border-gray-300 transition-colors">
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-navy-950 text-center mb-4">How It Works</h2>
          <p className="text-gray-500 text-center mb-14 max-w-xl mx-auto">Three simple steps to better lending terms</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', icon: '📋', title: 'Apply', desc: 'Complete our streamlined application in under 10 minutes. No lengthy bank forms — just the essentials.' },
              { step: '02', icon: '🔍', title: 'We Underwrite', desc: 'Our team packages your deal professionally, identifying your strengths and the right lending fit.' },
              { step: '03', icon: '🏦', title: 'Banks Compete', desc: 'Multiple banks review your deal simultaneously. You pick the best terms — we negotiate on your behalf.' },
            ].map((item) => (
              <div key={item.step} className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-md transition-shadow">
                <div className="text-3xl mb-4">{item.icon}</div>
                <div className="text-xs font-semibold text-navy-400 mb-2">STEP {item.step}</div>
                <h3 className="text-xl font-semibold text-navy-950 mb-3">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-navy-950 text-center mb-4">Why Credit Simplicity?</h2>
          <p className="text-gray-500 text-center mb-14 max-w-xl mx-auto">We flip the traditional lending process on its head</p>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { icon: '⚡', title: 'Transparent Process', desc: 'Track every step of your application in real-time through your personal portal.' },
              { icon: '🏆', title: 'Bank Competition', desc: 'When banks compete, you win. Better rates, better terms, better outcomes.' },
              { icon: '🤝', title: 'Expert Guidance', desc: 'Dedicated analysts who understand your business and advocate for your deal.' },
              { icon: '🔒', title: 'Secure & Confidential', desc: 'Bank-level security. Your data is encrypted and shared only with your permission.' },
              { icon: '⏱️', title: 'Save Time', desc: 'One application instead of ten. We handle the legwork so you can run your business.' },
              { icon: '💰', title: 'No Upfront Cost', desc: 'Free to apply. We only succeed when you get the right loan at the right terms.' },
            ].map((item) => (
              <div key={item.title} className="flex gap-4 p-6 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="text-2xl flex-shrink-0 mt-1">{item.icon}</div>
                <div>
                  <h3 className="font-semibold text-navy-950 mb-1">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-navy-900">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to simplify your lending?</h2>
          <p className="text-navy-200 mb-8 text-lg">No obligation. No credit pull. Just a conversation about your business.</p>
          <Link href="/apply" className="inline-block bg-white text-navy-900 px-8 py-3.5 rounded-xl text-base font-semibold hover:bg-gray-100 transition-colors">
            Get Started →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-navy-900 rounded flex items-center justify-center">
              <span className="text-white font-bold text-[10px]">CS</span>
            </div>
            <span className="text-sm text-gray-500">© 2024 Credit Simplicity. All rights reserved.</span>
          </div>
          <div className="flex gap-6 text-sm text-gray-400">
            <a href="#" className="hover:text-gray-600">Privacy</a>
            <a href="#" className="hover:text-gray-600">Terms</a>
            <a href="#" className="hover:text-gray-600">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
