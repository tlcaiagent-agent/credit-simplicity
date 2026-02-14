-- Credit Simplicity Database Schema

CREATE TABLE borrowers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  phone text,
  company_name text,
  industry text,
  years_in_business text,
  annual_revenue text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE loan_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  borrower_id uuid REFERENCES borrowers(id) ON DELETE CASCADE,
  amount_requested text,
  loan_purpose text,
  status text DEFAULT 'applied' CHECK (status IN ('applied','initial_meeting','needs_list','under_review','banks_reviewing','term_sheets','closing')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  loan_application_id uuid REFERENCES loan_applications(id) ON DELETE CASCADE,
  category text NOT NULL,
  filename text,
  file_url text,
  status text DEFAULT 'not_started' CHECK (status IN ('not_started','uploaded','under_review','approved')),
  uploaded_at timestamptz
);

CREATE TABLE meetings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  loan_application_id uuid REFERENCES loan_applications(id) ON DELETE CASCADE,
  meeting_type text,
  scheduled_at timestamptz,
  teams_link text,
  recording_url text,
  notes text,
  status text DEFAULT 'scheduled'
);
