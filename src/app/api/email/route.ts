import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { to, subject, html } = await req.json()

  const resendKey = process.env.RESEND_API_KEY
  if (!resendKey || resendKey.includes('placeholder')) {
    return NextResponse.json({ success: true, demo: true, message: 'Email skipped (no API key)' })
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'Credit Simplicity <noreply@creditsimplicity.com>',
        to,
        subject,
        html,
      }),
    })

    const data = await res.json()
    if (!res.ok) return NextResponse.json({ error: data }, { status: res.status })
    return NextResponse.json({ success: true, id: data.id })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
