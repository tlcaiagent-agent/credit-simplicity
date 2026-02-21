import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase-server'
import { DEFAULT_DOCUMENT_CATEGORIES } from '@/lib/document-categories'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, email, phone, company_name, industry, years_in_business, annual_revenue, amount_requested, loan_purpose } = body

  if (!name || !email || !amount_requested) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const supabase = getServiceClient()
  if (!supabase) {
    // Demo mode — return fake success
    return NextResponse.json({ success: true, demo: true, message: 'Application received (demo mode)' })
  }

  try {
    // 1. Create auth user with magic link
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      email_confirm: false,
      user_metadata: { name, company_name },
    })

    if (authError && !authError.message.includes('already been registered')) {
      console.error('Auth error:', authError)
      return NextResponse.json({ error: 'Failed to create account' }, { status: 500 })
    }

    const authUserId = authData?.user?.id

    // 2. Create borrower
    const { data: borrower, error: borrowerError } = await supabase
      .from('borrowers')
      .upsert({ email, name, phone, company_name, industry, years_in_business, annual_revenue, auth_user_id: authUserId }, { onConflict: 'email' })
      .select()
      .single()

    if (borrowerError) {
      console.error('Borrower error:', borrowerError)
      return NextResponse.json({ error: 'Failed to save borrower' }, { status: 500 })
    }

    // 3. Create loan application
    const { data: loan, error: loanError } = await supabase
      .from('loan_applications')
      .insert({ borrower_id: borrower.id, amount_requested, loan_purpose })
      .select()
      .single()

    if (loanError) {
      console.error('Loan error:', loanError)
      return NextResponse.json({ error: 'Failed to create application' }, { status: 500 })
    }

    // 4. Create default document needs list
    const docInserts = DEFAULT_DOCUMENT_CATEGORIES.map(category => ({
      loan_application_id: loan.id,
      category,
      status: 'not_started' as const,
    }))
    await supabase.from('documents').insert(docInserts)

    // 5. Create welcome message
    await supabase.from('messages').insert({
      loan_application_id: loan.id,
      from_name: 'Credit Simplicity Team',
      message: `Welcome, ${name.split(' ')[0]}! We've received your application and will assign you a dedicated analyst shortly.`,
    })

    // 6. Generate invite link for account setup
    let inviteUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.creditsimplicity.com'}/portal/setup`
    
    if (authUserId) {
      const { data: inviteData, error: inviteError } = await supabase.auth.admin.generateLink({
        type: 'invite',
        email,
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.creditsimplicity.com'}/portal/setup`
        }
      })
      
      if (inviteData?.properties?.action_link) {
        inviteUrl = inviteData.properties.action_link
      } else if (inviteError) {
        console.error('Invite link generation error:', inviteError)
      }
    }

    // 7. Send confirmation email via Resend
    try {
      const resendKey = process.env.RESEND_API_KEY
      if (resendKey && !resendKey.includes('placeholder')) {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: 'Credit Simplicity <noreply@creditsimplicity.com>',
            to: email,
            subject: 'Set Up Your Account — Credit Simplicity',
            html: `
              <h2>Welcome, ${name.split(' ')[0]}!</h2>
              <p>We've received your loan application for ${amount_requested}.</p>
              <p>Your dedicated portal is ready. Click the button below to set up your account and start tracking your application progress, upload documents, and communicate with your analyst.</p>
              <p style="margin: 24px 0;">
                <a href="${inviteUrl}" style="background: #1e293b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 500;">Set Up Your Account →</a>
              </p>
              <p style="font-size: 14px; color: #666;">If the button doesn't work, copy and paste this link: ${inviteUrl}</p>
              <p>— The Credit Simplicity Team</p>
            `,
          }),
        })
      }
    } catch (emailErr) {
      console.error('Email send error (non-blocking):', emailErr)
    }

    return NextResponse.json({ success: true, loanId: loan.id, borrowerId: borrower.id })
  } catch (err) {
    console.error('Unexpected error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
