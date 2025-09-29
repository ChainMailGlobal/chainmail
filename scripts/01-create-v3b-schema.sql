-- V3b Scheduled Remote Witness Database Schema
-- This schema supports the full V3b workflow including scheduling, witness sessions, and audit trails

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (customers who need mailbox services)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CMRA Agents table (witness providers)
CREATE TABLE IF NOT EXISTS cmra_agents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  cmra_name VARCHAR(255) NOT NULL,
  cmra_license VARCHAR(100),
  phone VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Witness Sessions table (V3b remote sessions)
CREATE TABLE IF NOT EXISTS witness_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  cmra_agent_id UUID REFERENCES cmra_agents(id) ON DELETE SET NULL,
  
  -- Session details
  session_type VARCHAR(50) DEFAULT 'v3b_remote',
  status VARCHAR(50) DEFAULT 'scheduled', -- scheduled, in_progress, completed, cancelled
  
  -- Scheduling
  scheduled_at TIMESTAMP WITH TIME ZONE,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Video call details
  video_room_id VARCHAR(255),
  video_recording_url TEXT,
  
  -- Customer data
  customer_face_video_url TEXT,
  customer_signature_url TEXT,
  customer_id_document_url TEXT,
  customer_verbal_acknowledgment TEXT,
  
  -- Witness data
  witness_face_video_url TEXT,
  witness_signature_url TEXT,
  witness_confirmation TEXT,
  
  -- AI Analysis
  confidence_score DECIMAL(5,2),
  liveness_score DECIMAL(5,2),
  fraud_flags JSONB DEFAULT '[]',
  ai_analysis JSONB,
  
  -- Generated documents
  form_1583_url TEXT,
  witness_certificate_url TEXT,
  
  -- Audit trail
  ipfs_hash VARCHAR(255),
  blockchain_tx_hash VARCHAR(255),
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Session Events table (audit log for all session activities)
CREATE TABLE IF NOT EXISTS session_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES witness_sessions(id) ON DELETE CASCADE,
  event_type VARCHAR(100) NOT NULL, -- session_scheduled, session_started, customer_joined, etc.
  event_data JSONB DEFAULT '{}',
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID, -- user_id or cmra_agent_id
  ip_address INET,
  user_agent TEXT
);

-- Calendar Availability table (for CMRA agent scheduling)
CREATE TABLE IF NOT EXISTS agent_availability (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cmra_agent_id UUID REFERENCES cmra_agents(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL, -- 0=Sunday, 6=Saturday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_witness_sessions_user_id ON witness_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_witness_sessions_cmra_agent_id ON witness_sessions(cmra_agent_id);
CREATE INDEX IF NOT EXISTS idx_witness_sessions_status ON witness_sessions(status);
CREATE INDEX IF NOT EXISTS idx_witness_sessions_scheduled_at ON witness_sessions(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_session_events_session_id ON session_events(session_id);
CREATE INDEX IF NOT EXISTS idx_session_events_timestamp ON session_events(timestamp);
CREATE INDEX IF NOT EXISTS idx_agent_availability_cmra_agent_id ON agent_availability(cmra_agent_id);

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE cmra_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE witness_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_events ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY users_select_own ON users
  FOR SELECT USING (auth.uid() = id);

-- CMRA agents can see their own data
CREATE POLICY cmra_agents_select_own ON cmra_agents
  FOR SELECT USING (auth.uid() = id);

-- Users can see their own sessions
CREATE POLICY witness_sessions_select_own_user ON witness_sessions
  FOR SELECT USING (auth.uid() = user_id);

-- CMRA agents can see sessions assigned to them
CREATE POLICY witness_sessions_select_own_agent ON witness_sessions
  FOR SELECT USING (auth.uid() = cmra_agent_id);

-- Session events visible to session participants
CREATE POLICY session_events_select_participants ON session_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM witness_sessions ws
      WHERE ws.id = session_events.session_id
      AND (ws.user_id = auth.uid() OR ws.cmra_agent_id = auth.uid())
    )
  );
