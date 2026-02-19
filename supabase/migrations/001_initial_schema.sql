-- Credit Simplicity Database Schema
-- Run this in your Supabase SQL Editor

-- Enums
CREATE TYPE loan_status AS ENUM ('applied', 'initial_meeting', 'needs_list', 'under_review', 'banks_reviewing', 'term_sheets', 'closing');
CREATE TYPE document_status AS ENUM ('not_started', 'uploaded', 'under_review', 'approved', 'rejected');

-- Borrowers
CREATE TABLE borrowers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  phone TEXT,
  company_name TEXT,
  industry TEXT,
  years_in_business TEXT,
  annual_revenue TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Loan Applications
CREATE TABLE loan_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  borrower_id UUID NOT NULL REFERENCES borrowers(id) ON DELETE CASCADE,
  amount_requested TEXT NOT NULL,
  loan_purpose TEXT,
  status loan_status DEFAULT 'applied',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Documents
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loan_application_id UUID NOT NULL REFERENCES loan_applications(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  filename TEXT DEFAULT '',
  file_path TEXT DEFAULT '',
  status document_status DEFAULT 'not_started',
  uploaded_at TIMESTAMPTZ
);

-- Meetings
CREATE TABLE meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loan_application_id UUID NOT NULL REFERENCES loan_applications(id) ON DELETE CASCADE,
  meeting_type TEXT NOT NULL,
  scheduled_at TIMESTAMPTZ,
  status TEXT DEFAULT 'scheduled',
  notes TEXT DEFAULT ''
);

-- Messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loan_application_id UUID NOT NULL REFERENCES loan_applications(id) ON DELETE CASCADE,
  from_name TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER loan_applications_updated_at
  BEFORE UPDATE ON loan_applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS Policies
ALTER TABLE borrowers ENABLE ROW LEVEL SECURITY;
ALTER TABLE loan_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Borrowers: users can only see their own record
CREATE POLICY "borrowers_own" ON borrowers
  FOR ALL USING (auth.uid() = auth_user_id);

-- Loan applications: borrower can see their own
CREATE POLICY "loans_own" ON loan_applications
  FOR ALL USING (borrower_id IN (SELECT id FROM borrowers WHERE auth_user_id = auth.uid()));

-- Documents: borrower can see/upload their own
CREATE POLICY "docs_own" ON documents
  FOR ALL USING (loan_application_id IN (
    SELECT la.id FROM loan_applications la
    JOIN borrowers b ON b.id = la.borrower_id
    WHERE b.auth_user_id = auth.uid()
  ));

-- Meetings: borrower can see their own
CREATE POLICY "meetings_own" ON meetings
  FOR ALL USING (loan_application_id IN (
    SELECT la.id FROM loan_applications la
    JOIN borrowers b ON b.id = la.borrower_id
    WHERE b.auth_user_id = auth.uid()
  ));

-- Messages: borrower can see their own
CREATE POLICY "messages_own" ON messages
  FOR ALL USING (loan_application_id IN (
    SELECT la.id FROM loan_applications la
    JOIN borrowers b ON b.id = la.borrower_id
    WHERE b.auth_user_id = auth.uid()
  ));

-- Service role bypass (for API routes) is automatic with service_role key

-- Storage bucket for documents
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false)
ON CONFLICT DO NOTHING;

-- Storage policy: borrowers can upload to their own folder
CREATE POLICY "docs_upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'documents' AND
    (storage.foldername(name))[1] IN (
      SELECT b.id::text FROM borrowers b WHERE b.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "docs_read" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'documents' AND
    (storage.foldername(name))[1] IN (
      SELECT b.id::text FROM borrowers b WHERE b.auth_user_id = auth.uid()
    )
  );
