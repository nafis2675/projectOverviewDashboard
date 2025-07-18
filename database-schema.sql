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
    description TEXT,
    lead_id UUID REFERENCES users(id),
    project_id UUID REFERENCES projects(id),
    deadline DATE,
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
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

-- Tasks table - Comprehensive task management
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR NOT NULL,
    description TEXT,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    project_part_id UUID REFERENCES project_parts(id) ON DELETE SET NULL,
    assigned_to UUID REFERENCES users(id) ON DELETE CASCADE,
    assigned_by UUID REFERENCES users(id) ON DELETE SET NULL,
    priority VARCHAR DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    status VARCHAR DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    deadline DATE,
    estimated_hours INTEGER,
    actual_hours INTEGER DEFAULT 0,
    category VARCHAR DEFAULT 'general' CHECK (category IN ('development', 'design', 'testing', 'documentation', 'meeting', 'review', 'general')),
    tags VARCHAR[],
    comments JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Task Comments table - For detailed task discussions
CREATE TABLE IF NOT EXISTS task_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    comment TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Task History table - For tracking task changes
CREATE TABLE IF NOT EXISTS task_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    action VARCHAR NOT NULL, -- 'created', 'assigned', 'progress_updated', 'status_changed', 'deadline_changed'
    old_value TEXT,
    new_value TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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

-- Todos table (for personal todos and project part todos)
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

-- Task-related indexes
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_by ON tasks(assigned_by);
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_project_part_id ON tasks(project_part_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_deadline ON tasks(deadline);
CREATE INDEX IF NOT EXISTS idx_task_comments_task_id ON task_comments(task_id);
CREATE INDEX IF NOT EXISTS idx_task_history_task_id ON task_history(task_id);

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

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
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

-- Insert sample tasks
INSERT INTO tasks (title, description, project_id, project_part_id, assigned_to, assigned_by, priority, status, progress, deadline, estimated_hours, category) VALUES 
('Implement User Authentication', 'Create login/logout functionality with JWT tokens', 
 (SELECT id FROM projects WHERE name = 'E-commerce Platform'), 
 (SELECT id FROM project_parts WHERE name = 'Frontend'), 
 (SELECT id FROM users WHERE email = 'alice.johnson@example.com'), 
 (SELECT id FROM users WHERE email = 'mike.chen@example.com'), 
 'high', 'completed', 100, '2026-01-15', 8, 'development'),

('Shopping Cart API', 'Develop REST API for shopping cart functionality', 
 (SELECT id FROM projects WHERE name = 'E-commerce Platform'), 
 (SELECT id FROM project_parts WHERE name = 'Backend'), 
 (SELECT id FROM users WHERE email = 'eva.wilson@example.com'), 
 (SELECT id FROM users WHERE email = 'mike.chen@example.com'), 
 'high', 'in_progress', 60, '2026-02-10', 12, 'development'),

('Product Catalog UI', 'Design and implement product catalog interface', 
 (SELECT id FROM projects WHERE name = 'E-commerce Platform'), 
 (SELECT id FROM project_parts WHERE name = 'Frontend'), 
 (SELECT id FROM users WHERE email = 'bob.smith@example.com'), 
 (SELECT id FROM users WHERE email = 'mike.chen@example.com'), 
 'medium', 'in_progress', 40, '2026-02-20', 16, 'development'),

('Payment Gateway Integration', 'Integrate Stripe payment processing', 
 (SELECT id FROM projects WHERE name = 'E-commerce Platform'), 
 (SELECT id FROM project_parts WHERE name = 'Backend'), 
 (SELECT id FROM users WHERE email = 'eva.wilson@example.com'), 
 (SELECT id FROM users WHERE email = 'john.smith@example.com'), 
 'urgent', 'pending', 0, '2026-03-01', 10, 'development'),

('Mobile App Navigation', 'Implement navigation system for mobile app', 
 (SELECT id FROM projects WHERE name = 'E-commerce Platform'), 
 (SELECT id FROM project_parts WHERE name = 'Mobile App'), 
 (SELECT id FROM users WHERE email = 'carol.davis@example.com'), 
 (SELECT id FROM users WHERE email = 'mike.chen@example.com'), 
 'medium', 'pending', 0, '2026-02-25', 6, 'development'),

('Customer Database Schema', 'Design and implement customer data structure', 
 (SELECT id FROM projects WHERE name = 'CRM System'), 
 (SELECT id FROM project_parts WHERE name = 'Core CRM'), 
 (SELECT id FROM users WHERE email = 'frank.brown@example.com'), 
 (SELECT id FROM users WHERE email = 'john.smith@example.com'), 
 'high', 'completed', 100, '2026-01-20', 12, 'development'),

('Lead Management Dashboard', 'Create dashboard for managing leads', 
 (SELECT id FROM projects WHERE name = 'CRM System'), 
 (SELECT id FROM project_parts WHERE name = 'Core CRM'), 
 (SELECT id FROM users WHERE email = 'grace.lee@example.com'), 
 (SELECT id FROM users WHERE email = 'john.smith@example.com'), 
 'medium', 'in_progress', 75, '2026-03-10', 20, 'development'),

('Analytics Charts', 'Implement data visualization charts', 
 (SELECT id FROM projects WHERE name = 'CRM System'), 
 (SELECT id FROM project_parts WHERE name = 'Analytics'), 
 (SELECT id FROM users WHERE email = 'henry.taylor@example.com'), 
 (SELECT id FROM users WHERE email = 'john.smith@example.com'), 
 'low', 'pending', 0, '2026-04-01', 14, 'development'),

('API Documentation', 'Create comprehensive API documentation', 
 (SELECT id FROM projects WHERE name = 'E-commerce Platform'), 
 NULL, 
 (SELECT id FROM users WHERE email = 'alice.johnson@example.com'), 
 (SELECT id FROM users WHERE email = 'mike.chen@example.com'), 
 'low', 'pending', 0, '2026-02-28', 8, 'documentation'),

('Testing Framework Setup', 'Set up automated testing framework', 
 (SELECT id FROM projects WHERE name = 'CRM System'), 
 NULL, 
 (SELECT id FROM users WHERE email = 'frank.brown@example.com'), 
 (SELECT id FROM users WHERE email = 'john.smith@example.com'), 
 'medium', 'pending', 0, '2026-03-15', 10, 'testing');

-- Insert sample task comments
INSERT INTO task_comments (task_id, user_id, comment) VALUES 
((SELECT id FROM tasks WHERE title = 'Implement User Authentication'), 
 (SELECT id FROM users WHERE email = 'alice.johnson@example.com'), 
 'Authentication system completed. JWT tokens are working properly.'),

((SELECT id FROM tasks WHERE title = 'Shopping Cart API'), 
 (SELECT id FROM users WHERE email = 'eva.wilson@example.com'), 
 'API endpoints for add/remove items are done. Working on quantity updates.'),

((SELECT id FROM tasks WHERE title = 'Lead Management Dashboard'), 
 (SELECT id FROM users WHERE email = 'grace.lee@example.com'), 
 'Dashboard layout is complete. Adding filtering functionality now.');

-- Insert sample task history
INSERT INTO task_history (task_id, user_id, action, old_value, new_value) VALUES 
((SELECT id FROM tasks WHERE title = 'Implement User Authentication'), 
 (SELECT id FROM users WHERE email = 'mike.chen@example.com'), 
 'created', NULL, 'Task created'),

((SELECT id FROM tasks WHERE title = 'Implement User Authentication'), 
 (SELECT id FROM users WHERE email = 'alice.johnson@example.com'), 
 'status_changed', 'pending', 'in_progress'),

((SELECT id FROM tasks WHERE title = 'Implement User Authentication'), 
 (SELECT id FROM users WHERE email = 'alice.johnson@example.com'), 
 'progress_updated', '0', '100'),

((SELECT id FROM tasks WHERE title = 'Shopping Cart API'), 
 (SELECT id FROM users WHERE email = 'eva.wilson@example.com'), 
 'progress_updated', '0', '60');

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_history ENABLE ROW LEVEL SECURITY;

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

CREATE POLICY "Allow all operations for authenticated users" ON tasks
    FOR ALL USING (true);

CREATE POLICY "Allow all operations for authenticated users" ON task_comments
    FOR ALL USING (true);

CREATE POLICY "Allow all operations for authenticated users" ON task_history
    FOR ALL USING (true); 