import { supabase, isDemoMode } from './supabase'
import { mockBorrower, mockLoanApplication, mockDocuments, mockMeetings, mockMessages } from './mock-data'

export async function getPortalData() {
  if (isDemoMode || !supabase) {
    return {
      borrower: mockBorrower,
      loan: mockLoanApplication,
      documents: mockDocuments,
      meetings: mockMeetings,
      messages: mockMessages,
      isDemo: true,
    }
  }

  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null // not logged in

    const { data: borrower } = await supabase
      .from('borrowers')
      .select('*')
      .eq('auth_user_id', user.id)
      .single()

    if (!borrower) return null

    const { data: loans } = await supabase
      .from('loan_applications')
      .select('*')
      .eq('borrower_id', borrower.id)
      .order('created_at', { ascending: false })
      .limit(1)

    const loan = loans?.[0] || null
    if (!loan) return { borrower, loan: null, documents: [], meetings: [], messages: [], isDemo: false }

    const [{ data: documents }, { data: meetings }, { data: messages }] = await Promise.all([
      supabase.from('documents').select('*').eq('loan_application_id', loan.id),
      supabase.from('meetings').select('*').eq('loan_application_id', loan.id).order('scheduled_at', { ascending: true }),
      supabase.from('messages').select('*').eq('loan_application_id', loan.id).order('created_at', { ascending: true }),
    ])

    return {
      borrower,
      loan,
      documents: documents || [],
      meetings: meetings || [],
      messages: messages || [],
      isDemo: false,
    }
  } catch (err) {
    console.error('Error fetching portal data:', err)
    // Fallback to mock
    return {
      borrower: mockBorrower,
      loan: mockLoanApplication,
      documents: mockDocuments,
      meetings: mockMeetings,
      messages: mockMessages,
      isDemo: true,
    }
  }
}

export async function uploadDocument(loanApplicationId: string, docId: string, file: File, borrowerId: string) {
  if (!supabase || isDemoMode) return { success: false, demo: true }

  const filePath = `${borrowerId}/${loanApplicationId}/${docId}_${file.name}`

  const { error: uploadError } = await supabase.storage
    .from('documents')
    .upload(filePath, file, { upsert: true })

  if (uploadError) {
    console.error('Upload error:', uploadError)
    return { success: false, error: uploadError.message }
  }

  const { error: updateError } = await supabase
    .from('documents')
    .update({ filename: file.name, file_path: filePath, status: 'uploaded', uploaded_at: new Date().toISOString() })
    .eq('id', docId)

  if (updateError) {
    console.error('Update error:', updateError)
    return { success: false, error: updateError.message }
  }

  return { success: true, filePath }
}
