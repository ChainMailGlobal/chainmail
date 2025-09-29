-- Seed data for V3b demo and testing

-- Insert demo CMRA agent
INSERT INTO cmra_agents (id, email, full_name, cmra_name, cmra_license, phone, is_active)
VALUES (
  '550e8400-e29b-41d4-a716-446655440001',
  'agent@streamlinewitness.com',
  'Sarah Johnson',
  'Downtown Mail Center',
  'CMRA-2024-001',
  '+1-555-0123',
  true
) ON CONFLICT (email) DO NOTHING;

-- Insert demo user
INSERT INTO users (id, email, full_name, phone)
VALUES (
  '550e8400-e29b-41d4-a716-446655440002',
  'demo@customer.com',
  'John Smith',
  '+1-555-0456'
) ON CONFLICT (email) DO NOTHING;

-- Insert demo witness session
INSERT INTO witness_sessions (
  id,
  user_id,
  cmra_agent_id,
  session_type,
  status,
  scheduled_at,
  confidence_score,
  liveness_score,
  metadata
)
VALUES (
  '550e8400-e29b-41d4-a716-446655440003',
  '550e8400-e29b-41d4-a716-446655440002',
  '550e8400-e29b-41d4-a716-446655440001',
  'v3b_remote',
  'scheduled',
  NOW() + INTERVAL '2 hours',
  NULL,
  NULL,
  '{"demo": true, "notes": "Demo session for testing"}'
) ON CONFLICT (id) DO NOTHING;

-- Insert agent availability (Monday-Friday, 9 AM - 5 PM)
INSERT INTO agent_availability (cmra_agent_id, day_of_week, start_time, end_time)
SELECT 
  '550e8400-e29b-41d4-a716-446655440001',
  day,
  '09:00:00',
  '17:00:00'
FROM generate_series(1, 5) AS day
ON CONFLICT DO NOTHING;
