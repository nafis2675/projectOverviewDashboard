-- Project Dashboard Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (Members)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR UNIQUE,
    name VARCHAR NOT NULL,
    role VARCHAR CHECK (role IN ('manager', 'teamLead', 'member')) DEFAULT 'member',
    team_id UUID,
    tasks INTEGER[],
    personal_todos JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR NOT NULL,
    description TEXT,
    manager_id UUID REFERENCES users(id),
    deadline DATE,
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    status VARCHAR DEFAULT 'active' CHECK (status IN ('active', 'completed', 'pending', 'overdue')),
    activity_log JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Teams table
CREATE TABLE IF NOT EXISTS teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR NOT NULL,
    lead_id UUID REFERENCES users(id),
    project_id UUID REFERENCES projects(id),
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    deadline DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Project Parts table
CREATE TABLE IF NOT EXISTS project_parts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR NOT NULL,
    description TEXT,
    weight INTEGER NOT NULL CHECK (weight >= 1 AND weight <= 100),
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Team Members junction table
CREATE TABLE IF NOT EXISTS team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(team_id, user_id)
);

-- Project Teams junction table
CREATE TABLE IF NOT EXISTS project_teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(project_id, team_id)
);

-- Todos table
CREATE TABLE IF NOT EXISTS todos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    part_id UUID REFERENCES project_parts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    text TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_team_id ON users(team_id);
CREATE INDEX IF NOT EXISTS idx_projects_manager_id ON projects(manager_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_teams_lead_id ON teams(lead_id);
CREATE INDEX IF NOT EXISTS idx_teams_project_id ON teams(project_id);
CREATE INDEX IF NOT EXISTS idx_project_parts_project_id ON project_parts(project_id);
CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_project_teams_project_id ON project_teams(project_id);
CREATE INDEX IF NOT EXISTS idx_project_teams_team_id ON project_teams(team_id);
CREATE INDEX IF NOT EXISTS idx_todos_part_id ON todos(part_id);
CREATE INDEX IF NOT EXISTS idx_todos_user_id ON todos(user_id);
CREATE INDEX IF NOT EXISTS idx_todos_completed ON todos(completed);

-- Update timestamps trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_parts_updated_at BEFORE UPDATE ON project_parts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_todos_updated_at BEFORE UPDATE ON todos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO users (name, email, role) VALUES 
('John Smith', 'john.smith@example.com', 'manager'),
('Alice Johnson', 'alice.johnson@example.com', 'member'),
('Bob Smith', 'bob.smith@example.com', 'member'),
('Carol Davis', 'carol.davis@example.com', 'member'),
('Mike Chen', 'mike.chen@example.com', 'teamLead'),
('Eva Wilson', 'eva.wilson@example.com', 'member'),
('Frank Brown', 'frank.brown@example.com', 'member'),
('Grace Lee', 'grace.lee@example.com', 'member'),
('Henry Taylor', 'henry.taylor@example.com', 'member')
ON CONFLICT (email) DO NOTHING;

-- Insert sample projects
INSERT INTO projects (name, description, manager_id, deadline, progress, status) VALUES 
('E-commerce Platform', 'Building a modern e-commerce platform with React and Node.js', 
 (SELECT id FROM users WHERE email = 'john.smith@example.com'), 
 '2026-03-15', 75, 'active'),
('CRM System', 'Customer relationship management system for enterprise clients', 
 (SELECT id FROM users WHERE email = 'john.smith@example.com'), 
 '2026-04-20', 45, 'active')
ON CONFLICT DO NOTHING;

-- Insert sample teams
INSERT INTO teams (name, lead_id, project_id, progress, deadline) VALUES 
('Frontend Team', 
 (SELECT id FROM users WHERE email = 'mike.chen@example.com'), 
 (SELECT id FROM projects WHERE name = 'E-commerce Platform'), 
 80, '2026-03-15'),
('Backend Team', 
 (SELECT id FROM users WHERE email = 'mike.chen@example.com'), 
 (SELECT id FROM projects WHERE name = 'E-commerce Platform'), 
 70, '2026-03-15'),
('CRM Team', 
 (SELECT id FROM users WHERE email = 'mike.chen@example.com'), 
 (SELECT id FROM projects WHERE name = 'CRM System'), 
 45, '2026-04-20');

-- Insert project-team relationships
INSERT INTO project_teams (project_id, team_id) VALUES 
((SELECT id FROM projects WHERE name = 'E-commerce Platform'), 
 (SELECT id FROM teams WHERE name = 'Frontend Team')),
((SELECT id FROM projects WHERE name = 'E-commerce Platform'), 
 (SELECT id FROM teams WHERE name = 'Backend Team')),
((SELECT id FROM projects WHERE name = 'CRM System'), 
 (SELECT id FROM teams WHERE name = 'CRM Team'));

-- Insert sample team members
INSERT INTO team_members (team_id, user_id) VALUES 
((SELECT id FROM teams WHERE name = 'Frontend Team'), 
 (SELECT id FROM users WHERE email = 'alice.johnson@example.com')),
((SELECT id FROM teams WHERE name = 'Frontend Team'), 
 (SELECT id FROM users WHERE email = 'bob.smith@example.com')),
((SELECT id FROM teams WHERE name = 'Frontend Team'), 
 (SELECT id FROM users WHERE email = 'carol.davis@example.com')),
((SELECT id FROM teams WHERE name = 'Backend Team'), 
 (SELECT id FROM users WHERE email = 'eva.wilson@example.com')),
((SELECT id FROM teams WHERE name = 'CRM Team'), 
 (SELECT id FROM users WHERE email = 'frank.brown@example.com')),
((SELECT id FROM teams WHERE name = 'CRM Team'), 
 (SELECT id FROM users WHERE email = 'grace.lee@example.com')),
((SELECT id FROM teams WHERE name = 'CRM Team'), 
 (SELECT id FROM users WHERE email = 'henry.taylor@example.com'));

-- Insert sample project parts
INSERT INTO project_parts (project_id, name, description, weight, progress) VALUES 
((SELECT id FROM projects WHERE name = 'E-commerce Platform'), 
 'Frontend', 'User interface and experience', 40, 80),
((SELECT id FROM projects WHERE name = 'E-commerce Platform'), 
 'Backend', 'Server-side logic and APIs', 35, 70),
((SELECT id FROM projects WHERE name = 'E-commerce Platform'), 
 'Mobile App', 'Mobile application development', 25, 60),
((SELECT id FROM projects WHERE name = 'CRM System'), 
 'Core CRM', 'Customer management features', 50, 50),
((SELECT id FROM projects WHERE name = 'CRM System'), 
 'Analytics', 'Data analysis and reporting', 30, 30),
((SELECT id FROM projects WHERE name = 'CRM System'), 
 'Integration', 'Third-party integrations', 20, 20);

-- Insert sample todos
INSERT INTO todos (part_id, text, completed) VALUES 
((SELECT id FROM project_parts WHERE name = 'Frontend'), 
 'Design system implementation', TRUE),
((SELECT id FROM project_parts WHERE name = 'Frontend'), 
 'User authentication', TRUE),
((SELECT id FROM project_parts WHERE name = 'Frontend'), 
 'Shopping cart functionality', FALSE),
((SELECT id FROM project_parts WHERE name = 'Frontend'), 
 'Payment integration', FALSE),
((SELECT id FROM project_parts WHERE name = 'Backend'), 
 'API development', TRUE),
((SELECT id FROM project_parts WHERE name = 'Backend'), 
 'Database design', TRUE),
((SELECT id FROM project_parts WHERE name = 'Backend'), 
 'Security implementation', FALSE),
((SELECT id FROM project_parts WHERE name = 'Mobile App'), 
 'UI/UX design', TRUE),
((SELECT id FROM project_parts WHERE name = 'Mobile App'), 
 'Core functionality', FALSE),
((SELECT id FROM project_parts WHERE name = 'Mobile App'), 
 'Testing and optimization', FALSE),
((SELECT id FROM project_parts WHERE name = 'Core CRM'), 
 'Customer database', TRUE),
((SELECT id FROM project_parts WHERE name = 'Core CRM'), 
 'Lead management', FALSE),
((SELECT id FROM project_parts WHERE name = 'Core CRM'), 
 'Reporting system', FALSE),
((SELECT id FROM project_parts WHERE name = 'Analytics'), 
 'Data visualization', FALSE),
((SELECT id FROM project_parts WHERE name = 'Analytics'), 
 'Performance metrics', FALSE),
((SELECT id FROM project_parts WHERE name = 'Integration'), 
 'Third-party APIs', FALSE);

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- Allow all operations for authenticated users (you can make this more restrictive later)
CREATE POLICY "Allow all operations for authenticated users" ON users
    FOR ALL USING (true);

CREATE POLICY "Allow all operations for authenticated users" ON projects
    FOR ALL USING (true);

CREATE POLICY "Allow all operations for authenticated users" ON teams
    FOR ALL USING (true);

CREATE POLICY "Allow all operations for authenticated users" ON project_parts
    FOR ALL USING (true);

CREATE POLICY "Allow all operations for authenticated users" ON team_members
    FOR ALL USING (true);

CREATE POLICY "Allow all operations for authenticated users" ON project_teams
    FOR ALL USING (true);

CREATE POLICY "Allow all operations for authenticated users" ON todos
    FOR ALL USING (true); 