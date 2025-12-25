-- Diagnose Plus Database Schema
-- PostgreSQL Database Setup

-- Create database (run this separately as superuser)
-- CREATE DATABASE diagnose_plus;

-- Connect to the database
-- \c diagnose_plus;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- USERS TABLE
-- =============================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'partner')),
    full_name VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster email lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- =============================================
-- PARTNERS TABLE
-- =============================================
CREATE TABLE partners (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    business_name VARCHAR(255) NOT NULL,
    registration_number VARCHAR(100) UNIQUE,
    district VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    whatsapp VARCHAR(20),
    website VARCHAR(255),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    services JSONB DEFAULT '[]',
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended', 'rejected')),
    rating DECIMAL(3, 2) DEFAULT 0.00,
    years_operation INTEGER,
    staff_count INTEGER,
    certificate_path VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for faster queries
CREATE INDEX idx_partners_user_id ON partners(user_id);
CREATE INDEX idx_partners_district ON partners(district);
CREATE INDEX idx_partners_status ON partners(status);
CREATE INDEX idx_partners_services ON partners USING GIN(services);

-- =============================================
-- TICKETS TABLE
-- =============================================
CREATE TABLE tickets (
    id SERIAL PRIMARY KEY,
    partner_id INTEGER REFERENCES partners(id) ON DELETE CASCADE,
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    priority VARCHAR(50) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    assigned_to INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_tickets_partner_id ON tickets(partner_id);
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_tickets_assigned_to ON tickets(assigned_to);

-- =============================================
-- TICKET REPLIES TABLE
-- =============================================
CREATE TABLE ticket_replies (
    id SERIAL PRIMARY KEY,
    ticket_id INTEGER REFERENCES tickets(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id),
    message TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index
CREATE INDEX idx_ticket_replies_ticket_id ON ticket_replies(ticket_id);

-- =============================================
-- SUBSCRIPTIONS TABLE
-- =============================================
CREATE TABLE subscriptions (
    id SERIAL PRIMARY KEY,
    partner_id INTEGER REFERENCES partners(id) ON DELETE CASCADE,
    plan_type VARCHAR(50) NOT NULL CHECK (plan_type IN ('basic', 'premium', 'enterprise')),
    amount DECIMAL(10, 2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled', 'pending')),
    payment_method VARCHAR(50),
    transaction_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_subscriptions_partner_id ON subscriptions(partner_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_end_date ON subscriptions(end_date);

-- =============================================
-- LEADS TABLE
-- =============================================
CREATE TABLE leads (
    id SERIAL PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    district VARCHAR(100) NOT NULL,
    service_type VARCHAR(100) NOT NULL,
    message TEXT,
    assigned_partner_id INTEGER REFERENCES partners(id),
    status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'assigned', 'contacted', 'converted', 'lost')),
    source VARCHAR(50) DEFAULT 'website' CHECK (source IN ('website', 'phone', 'whatsapp', 'referral')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_leads_district ON leads(district);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_assigned_partner_id ON leads(assigned_partner_id);

-- =============================================
-- SERVICE MANUALS TABLE
-- =============================================
CREATE TABLE service_manuals (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_path VARCHAR(255) NOT NULL,
    file_size INTEGER,
    category VARCHAR(100) CHECK (category IN ('diagnostics', 'repair', 'maintenance', 'training', 'other')),
    version VARCHAR(50),
    uploaded_by INTEGER REFERENCES users(id),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index
CREATE INDEX idx_service_manuals_category ON service_manuals(category);

-- =============================================
-- MANUAL DOWNLOADS TABLE
-- =============================================
CREATE TABLE manual_downloads (
    id SERIAL PRIMARY KEY,
    partner_id INTEGER REFERENCES partners(id) ON DELETE CASCADE,
    manual_id INTEGER REFERENCES service_manuals(id) ON DELETE CASCADE,
    downloaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_manual_downloads_partner_id ON manual_downloads(partner_id);
CREATE INDEX idx_manual_downloads_manual_id ON manual_downloads(manual_id);

-- =============================================
-- TRIGGERS FOR UPDATED_AT
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_partners_updated_at BEFORE UPDATE ON partners
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tickets_updated_at BEFORE UPDATE ON tickets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- SEED DATA (Optional - for testing)
-- =============================================

-- Create admin user (password: admin123 - CHANGE IN PRODUCTION!)
-- Password hash for 'admin123' using bcrypt with 10 rounds
INSERT INTO users (email, password_hash, role, full_name, is_active)
VALUES ('admin@diagnoseplus.lk', '$2a$10$rQZ8vZ8vZ8vZ8vZ8vZ8vZeKGYxKGYxKGYxKGYxKGYxKGYxKGYxKGY', 'admin', 'System Administrator', true);

-- Note: The password hash above is a placeholder. 
-- You'll need to generate a real hash using bcrypt when creating the admin user.

-- =============================================
-- VIEWS (Optional - for common queries)
-- =============================================

-- View for active partners with subscription info
CREATE VIEW active_partners_view AS
SELECT 
    p.*,
    u.email as user_email,
    s.plan_type,
    s.end_date as subscription_end_date,
    s.status as subscription_status
FROM partners p
JOIN users u ON p.user_id = u.id
LEFT JOIN subscriptions s ON p.id = s.partner_id AND s.status = 'active'
WHERE p.status = 'active';

-- View for ticket statistics
CREATE VIEW ticket_stats_view AS
SELECT 
    partner_id,
    COUNT(*) as total_tickets,
    COUNT(CASE WHEN status = 'open' THEN 1 END) as open_tickets,
    COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress_tickets,
    COUNT(CASE WHEN status = 'resolved' THEN 1 END) as resolved_tickets,
    COUNT(CASE WHEN status = 'closed' THEN 1 END) as closed_tickets
FROM tickets
GROUP BY partner_id;

-- =============================================
-- GRANT PERMISSIONS (adjust as needed)
-- =============================================

-- Grant permissions to application user
-- CREATE USER diagnose_app WITH PASSWORD 'your_secure_password';
-- GRANT CONNECT ON DATABASE diagnose_plus TO diagnose_app;
-- GRANT USAGE ON SCHEMA public TO diagnose_app;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO diagnose_app;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO diagnose_app;
