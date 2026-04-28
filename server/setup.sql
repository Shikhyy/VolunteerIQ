-- VolunteerIQ Database Setup
-- Run this in Supabase SQL Editor

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  urgency INTEGER DEFAULT 3,
  status TEXT DEFAULT 'open',
  address TEXT,
  city TEXT,
  district TEXT,
  deadline TIMESTAMPTZ,
  slots_needed INTEGER DEFAULT 1,
  slots_filled INTEGER DEFAULT 0,
  required_skills TEXT[],
  priority_score FLOAT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create volunteers table
CREATE TABLE IF NOT EXISTS volunteers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE,
  phone TEXT,
  location JSONB,
  skills TEXT[],
  availability TEXT[],
  status TEXT DEFAULT 'active',
  tasks_completed INTEGER DEFAULT 0,
  reliability_score FLOAT,
  joined_at DATE,
  user_id TEXT
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT,
  type TEXT,
  title TEXT,
  body TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Tasks: everyone can read, only authenticated can do anything
CREATE POLICY "Public tasks" ON tasks FOR SELECT USING (true);
CREATE POLICY "Authenticated tasks" ON tasks FOR ALL USING (true);

-- Volunteers: everyone can read, only authenticated can do anything
CREATE POLICY "Public volunteers" ON volunteers FOR SELECT USING (true);
CREATE POLICY "Authenticated volunteers" ON volunteers FOR ALL USING (true);

-- Notifications: users can only see their own
CREATE POLICY "Own notifications" ON notifications FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Own notifications update" ON notifications FOR ALL USING (auth.uid()::text = user_id);

-- Insert sample data
INSERT INTO tasks (title, description, category, urgency, status, address, city, district, deadline, slots_needed, slots_filled, required_skills, priority_score) VALUES
('Medical camp setup — Okhla', 'Set up a 50-bed medical camp for flood relief. Need people with medical training and physical fitness.', 'Medical', 5, 'in_progress', 'Okhla Industrial Area', 'Delhi', 'South Delhi', NOW() + INTERVAL '2 days', 8, 5, ARRAY['Medical', 'Logistics'], 0.91),
('Food packet distribution — Rohini', 'Distribute food packets to flood-affected families in the Rohini area.', 'Logistics', 4, 'open', 'Rohini Sector 15', 'Delhi', 'North Delhi', NOW() + INTERVAL '3 days', 6, 3, ARRAY['Logistics'], 0.82),
('Teaching support — Dwarka', 'Help students with their studies in the community center.', 'Teaching', 3, 'open', 'Dwarka', 'Delhi', 'South West Delhi', NOW() + INTERVAL '5 days', 4, 2, ARRAY['Teaching'], 0.65),
('Elderly care home — Janakpuri', 'Assist with daily activities at the elderly care home.', 'Admin', 2, 'open', 'Janakpuri', 'Delhi', 'West Delhi', NOW() + INTERVAL '7 days', 3, 1, ARRAY['Admin'], 0.45),
('Mobile clinic — Sarojini Nagar', 'Support the mobile health clinic with registration and logistics.', 'Medical', 4, 'open', 'Sarojini Nagar', 'Delhi', 'South Delhi', NOW() + INTERVAL '4 days', 5, 2, ARRAY['Medical', 'Admin'], 0.78),
('Shelter construction — Narela', 'Help build temporary shelters for flood-affected families.', 'Construction', 5, 'open', 'Narela', 'Delhi', 'North Delhi', NOW() + INTERVAL '1 day', 10, 4, ARRAY['Construction', 'Logistics'], 0.95);

INSERT INTO volunteers (name, email, phone, location, skills, availability, status, tasks_completed, reliability_score, joined_at) VALUES
('Priya Sharma', 'priya@example.com', '+91 9876543210', '{"city": "Delhi", "district": "South Delhi"}', ARRAY['Medical', 'Teaching'], ARRAY['Saturday', 'Sunday'], 'active', 12, 0.87, '2026-03-01'),
('Amit Kumar', 'amit@example.com', '+91 9876543211', '{"city": "Delhi", "district": "North Delhi"}', ARRAY['Logistics', 'Driving'], ARRAY['Saturday', 'Sunday', 'Monday'], 'active', 8, 0.92, '2026-03-15'),
('Neha Gupta', 'neha@example.com', '+91 9876543212', '{"city": "Delhi", "district": "West Delhi"}', ARRAY['Tech', 'Admin'], ARRAY['Weekday evenings'], 'active', 5, 0.78, '2026-03-20'),
('Raj Patel', 'raj@example.com', '+91 9876543213', '{"city": "Delhi", "district": "Central Delhi"}', ARRAY['Medical'], ARRAY['Morning'], 'active', 3, 0.95, '2026-02-15'),
('Sita Devi', 'sita@example.com', '+91 9876543214', '{"city": "Delhi", "district": "South West Delhi"}', ARRAY['Cooking', 'Logistics'], ARRAY['Daily'], 'active', 15, 0.98, '2026-01-20');

-- Insert sample notifications
INSERT INTO notifications (user_id, type, title, body, read) VALUES
('dev-user-001', 'task_assigned', 'New task assigned', 'You have been assigned to "Medical camp setup — Okhla"', false),
('dev-user-001', 'task_reminder', 'Deadline approaching', 'Food distribution task due in 24 hours', false),
('dev-user-001', 'task_completed', 'Task completed', 'Elderly care home — Janakpuri has been marked as completed', true),
('dev-user-001', 'new_task', 'New task available', 'Shelter construction — Narela needs volunteers', true);

SELECT 'Database setup complete!' as status;
