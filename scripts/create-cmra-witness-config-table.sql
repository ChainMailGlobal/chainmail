-- Create cmra_witness_config table for CMRA operators to configure witness methods
CREATE TABLE IF NOT EXISTS cmra_witness_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cmra_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Witness method toggles
  ai_witness_enabled BOOLEAN DEFAULT true,
  live_video_enabled BOOLEAN DEFAULT true,
  in_person_enabled BOOLEAN DEFAULT true,
  
  -- Optional custom pricing (null = use default pricing)
  ai_witness_price DECIMAL(10,2),
  live_video_price DECIMAL(10,2),
  in_person_price DECIMAL(10,2),
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  -- Ensure one config per CMRA
  UNIQUE(cmra_id)
);

-- Enable RLS
ALTER TABLE cmra_witness_config ENABLE ROW LEVEL SECURITY;

-- Policy: CMRA operators can read their own config
CREATE POLICY "CMRA operators can read own witness config"
  ON cmra_witness_config
  FOR SELECT
  USING (auth.uid() = cmra_id);

-- Policy: CMRA operators can insert their own config
CREATE POLICY "CMRA operators can insert own witness config"
  ON cmra_witness_config
  FOR INSERT
  WITH CHECK (auth.uid() = cmra_id);

-- Policy: CMRA operators can update their own config
CREATE POLICY "CMRA operators can update own witness config"
  ON cmra_witness_config
  FOR UPDATE
  USING (auth.uid() = cmra_id);

-- Create index for faster lookups
CREATE INDEX idx_cmra_witness_config_cmra_id ON cmra_witness_config(cmra_id);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_cmra_witness_config_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_cmra_witness_config_updated_at
  BEFORE UPDATE ON cmra_witness_config
  FOR EACH ROW
  EXECUTE FUNCTION update_cmra_witness_config_updated_at();

COMMENT ON TABLE cmra_witness_config IS 'Configuration for witness methods available to CMRA customers';
