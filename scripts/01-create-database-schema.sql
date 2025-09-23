-- PashuSuchak AI Database Schema
-- PostgreSQL database setup for livestock management platform

-- Users table for authentication and role management
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('farmer', 'flw', 'admin')),
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    village VARCHAR(100),
    district VARCHAR(100),
    state VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- Animals table for registered livestock
CREATE TABLE IF NOT EXISTS animals (
    id SERIAL PRIMARY KEY,
    owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    tag_number VARCHAR(50) UNIQUE,
    species VARCHAR(50) NOT NULL CHECK (species IN ('cattle', 'buffalo')),
    breed VARCHAR(100),
    gender VARCHAR(10) CHECK (gender IN ('male', 'female')),
    date_of_birth DATE,
    weight DECIMAL(6,2),
    health_status VARCHAR(50) DEFAULT 'healthy',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Breed scans table for AI predictions
CREATE TABLE IF NOT EXISTS breed_scans (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    animal_id INTEGER REFERENCES animals(id) ON DELETE SET NULL,
    image_url VARCHAR(500) NOT NULL,
    predicted_breed VARCHAR(100),
    confidence_score DECIMAL(5,4),
    top_predictions JSONB, -- Store top-N predictions with scores
    user_feedback VARCHAR(100), -- confirmed, rejected, uncertain
    actual_breed VARCHAR(100), -- user-confirmed breed
    scan_location POINT, -- GPS coordinates
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Heat detection scans
CREATE TABLE IF NOT EXISTS heat_scans (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    animal_id INTEGER REFERENCES animals(id) ON DELETE SET NULL,
    media_url VARCHAR(500) NOT NULL,
    media_type VARCHAR(20) CHECK (media_type IN ('image', 'video')),
    heat_detected BOOLEAN,
    confidence_score DECIMAL(5,4),
    signs_detected JSONB, -- swollen_vulva, mucus, mounting_behavior
    alert_sent BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Feedback for model improvement
CREATE TABLE IF NOT EXISTS feedback (
    id SERIAL PRIMARY KEY,
    scan_id INTEGER, -- can reference breed_scans or heat_scans
    scan_type VARCHAR(20) CHECK (scan_type IN ('breed', 'heat')),
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    feedback_type VARCHAR(50), -- correction, rating, comment
    feedback_data JSONB,
    processed BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- System metrics and KPIs
CREATE TABLE IF NOT EXISTS metrics (
    id SERIAL PRIMARY KEY,
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(10,4),
    metric_date DATE DEFAULT CURRENT_DATE,
    district VARCHAR(100),
    state VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contact messages
CREATE TABLE IF NOT EXISTS contact_messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'unread',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Gamification: User achievements and badges
CREATE TABLE IF NOT EXISTS user_achievements (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    achievement_type VARCHAR(100), -- breed_expert, heat_detector, feedback_champion
    points INTEGER DEFAULT 0,
    badge_level VARCHAR(50), -- bronze, silver, gold
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_breed_scans_user_id ON breed_scans(user_id);
CREATE INDEX IF NOT EXISTS idx_breed_scans_created_at ON breed_scans(created_at);
CREATE INDEX IF NOT EXISTS idx_heat_scans_user_id ON heat_scans(user_id);
CREATE INDEX IF NOT EXISTS idx_heat_scans_created_at ON heat_scans(created_at);
CREATE INDEX IF NOT EXISTS idx_animals_owner_id ON animals(owner_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_metrics_date ON metrics(metric_date);
