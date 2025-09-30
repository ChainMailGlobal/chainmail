-- Add Ethereum blockchain fields to cmra_agents table
ALTER TABLE cmra_agents
ADD COLUMN IF NOT EXISTS eth_anchor_hash TEXT,
ADD COLUMN IF NOT EXISTS eth_anchor_tx_hash TEXT,
ADD COLUMN IF NOT EXISTS eth_anchor_block BIGINT,
ADD COLUMN IF NOT EXISTS eth_anchor_timestamp TIMESTAMP WITH TIME ZONE;

-- Add XRP Ledger blockchain fields to witness_sessions table
ALTER TABLE witness_sessions
ADD COLUMN IF NOT EXISTS xrpl_anchor_hash TEXT,
ADD COLUMN IF NOT EXISTS xrpl_tx_hash TEXT,
ADD COLUMN IF NOT EXISTS xrpl_ledger_seq BIGINT,
ADD COLUMN IF NOT EXISTS xrpl_anchor_timestamp TIMESTAMP WITH TIME ZONE;

-- Create indexes for blockchain lookups
CREATE INDEX IF NOT EXISTS idx_cmra_agents_eth_tx_hash ON cmra_agents(eth_anchor_tx_hash);
CREATE INDEX IF NOT EXISTS idx_witness_sessions_xrpl_tx_hash ON witness_sessions(xrpl_tx_hash);

-- Add comments for documentation
COMMENT ON COLUMN cmra_agents.eth_anchor_hash IS 'SHA-256 hash of all CMRA onboarding data, signatures, and PDFs';
COMMENT ON COLUMN cmra_agents.eth_anchor_tx_hash IS 'Ethereum/Polygon transaction hash for audit trail';
COMMENT ON COLUMN cmra_agents.eth_anchor_block IS 'Ethereum block number where the anchor was recorded';

COMMENT ON COLUMN witness_sessions.xrpl_anchor_hash IS 'SHA-256 hash of witness session artifacts (PDF, video, faces, timestamps)';
COMMENT ON COLUMN witness_sessions.xrpl_tx_hash IS 'XRP Ledger transaction hash for audit trail';
COMMENT ON COLUMN witness_sessions.xrpl_ledger_seq IS 'XRP Ledger sequence number where the anchor was recorded';
