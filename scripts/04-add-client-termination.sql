-- Add client termination tracking to users table

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active',
ADD COLUMN IF NOT EXISTS terminated_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS termination_reason TEXT;

-- Create index for status queries
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);

-- Add RLS policy for terminated users
CREATE POLICY users_terminated_visible_to_agents ON users
  FOR SELECT USING (
    status = 'terminated' AND EXISTS (
      SELECT 1 FROM cmra_agents WHERE cmra_agents.id = auth.uid()
    )
  );
