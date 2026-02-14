export const mockLoanApplication = {
  id: 'demo-loan-001',
  borrower_id: 'demo-borrower-001',
  amount_requested: 500000,
  loan_purpose: 'Equipment purchase and working capital',
  status: 'needs_list' as const,
  created_at: '2024-01-15T10:00:00Z',
  updated_at: '2024-01-20T14:30:00Z',
}

export const mockBorrower = {
  id: 'demo-borrower-001',
  email: 'demo@example.com',
  name: 'John Smith',
  phone: '(555) 123-4567',
  company_name: 'Smith Manufacturing LLC',
  industry: 'Manufacturing',
  years_in_business: 12,
  annual_revenue: '$2M - $5M',
  created_at: '2024-01-15T10:00:00Z',
}

export const mockDocuments = [
  { id: '1', category: 'Tax Returns (3 Years)', filename: '2023_tax_return.pdf', status: 'uploaded' as const },
  { id: '2', category: 'Tax Returns (3 Years)', filename: '2022_tax_return.pdf', status: 'approved' as const },
  { id: '3', category: 'Tax Returns (3 Years)', filename: '', status: 'not_started' as const },
  { id: '4', category: 'Financial Statements', filename: 'balance_sheet_2023.pdf', status: 'under_review' as const },
  { id: '5', category: 'Financial Statements', filename: '', status: 'not_started' as const },
  { id: '6', category: 'Personal Financial Statement', filename: '', status: 'not_started' as const },
  { id: '7', category: 'Business Plan', filename: 'business_plan_v3.pdf', status: 'uploaded' as const },
  { id: '8', category: 'AR/AP Aging Report', filename: '', status: 'not_started' as const },
  { id: '9', category: 'Debt Schedule', filename: 'debt_schedule.xlsx', status: 'uploaded' as const },
  { id: '10', category: 'Bank Statements (6 Months)', filename: '', status: 'not_started' as const },
]

export const mockMeetings = [
  { id: '1', meeting_type: 'Initial Consultation', scheduled_at: '2024-01-18T14:00:00Z', status: 'completed', notes: 'Discussed business history and loan needs. Strong candidate.' },
  { id: '2', meeting_type: 'Document Review', scheduled_at: '2024-01-25T10:00:00Z', status: 'scheduled', notes: '' },
]

export const mockMessages = [
  { id: '1', from: 'Credit Simplicity Team', message: 'Welcome! We\'ve received your application and assigned you a dedicated analyst.', date: '2024-01-15T10:30:00Z' },
  { id: '2', from: 'Sarah Chen, Analyst', message: 'I\'ve reviewed your initial application. Looking forward to our meeting on the 18th!', date: '2024-01-16T09:00:00Z' },
  { id: '3', from: 'Sarah Chen, Analyst', message: 'Great meeting today. I\'ve uploaded your needs list — please start gathering the documents when you can.', date: '2024-01-18T15:00:00Z' },
]

export type LoanStatus = 'applied' | 'initial_meeting' | 'needs_list' | 'under_review' | 'banks_reviewing' | 'term_sheets' | 'closing'

export const statusSteps: { key: LoanStatus; label: string }[] = [
  { key: 'applied', label: 'Applied' },
  { key: 'initial_meeting', label: 'Initial Meeting' },
  { key: 'needs_list', label: 'Needs List' },
  { key: 'under_review', label: 'Under Review' },
  { key: 'banks_reviewing', label: 'Banks Reviewing' },
  { key: 'term_sheets', label: 'Term Sheets' },
  { key: 'closing', label: 'Closing' },
]
