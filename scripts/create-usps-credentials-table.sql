-- Create usps_credentials table for storing encrypted USPS BCG and CRD credentials
CREATE TABLE IF NOT EXISTS usps_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES cmras(id) ON DELETE CASCADE,
  bcg_username TEXT,
  bcg_password_cipher TEXT,
  crd_username TEXT,
  crd_password_cipher TEXT,
  allow_rpa_password_reset BOOLEAN DEFAULT FALSE,
  status TEXT CHECK (status IN ('PENDING', 'SUBMITTED', 'VERIFIED', 'ESCALATED')) DEFAULT 'PENDING',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(org_id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_usps_credentials_org_id ON usps_credentials(org_id);
CREATE INDEX IF NOT EXISTS idx_usps_credentials_status ON usps_credentials(status);

-- Add RLS policies
ALTER TABLE usps_credentials ENABLE ROW LEVEL SECURITY;

-- Policy: CMRA owners/managers can view their own credentials
CREATE POLICY "CMRA owners can view own credentials"
  ON usps_credentials
  FOR SELECT
  USING (org_id IN (
    SELECT id FROM cmras WHERE owner_id = auth.uid()
  ));

-- Policy: CMRA owners/managers can insert/update their own credentials
CREATE POLICY "CMRA owners can manage own credentials"
  ON usps_credentials
  FOR ALL
  USING (org_id IN (
    SELECT id FROM cmras WHERE owner_id = auth.uid()
  ));

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_usps_credentials_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER usps_credentials_updated_at
  BEFORE UPDATE ON usps_credentials
  FOR EACH ROW
  EXECUTE FUNCTION update_usps_credentials_updated_at();
