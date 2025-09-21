-- Sample data for BreedScan AI platform
-- Insert sample users, animals, and scans for testing

-- Insert sample users (farmers, FLWs, admin)
INSERT INTO users (email, password_hash, role, full_name, phone, village, district, state) VALUES
-- Farmers
('farmer1@example.com', '$2b$10$example_hash_1', 'farmer', 'Rajesh Kumar', '+91-9876543210', 'Kharkhoda', 'Sonipat', 'Haryana'),
('farmer2@example.com', '$2b$10$example_hash_2', 'farmer', 'Priya Sharma', '+91-9876543211', 'Bahadurgarh', 'Jhajjar', 'Haryana'),
('farmer3@example.com', '$2b$10$example_hash_3', 'farmer', 'Suresh Patel', '+91-9876543212', 'Anand', 'Anand', 'Gujarat'),
('farmer4@example.com', '$2b$10$example_hash_4', 'farmer', 'Lakshmi Devi', '+91-9876543213', 'Karnal', 'Karnal', 'Haryana'),
('farmer5@example.com', '$2b$10$example_hash_5', 'farmer', 'Mohan Singh', '+91-9876543214', 'Hisar', 'Hisar', 'Haryana'),
('farmer6@example.com', '$2b$10$example_hash_6', 'farmer', 'Sunita Yadav', '+91-9876543215', 'Rohtak', 'Rohtak', 'Haryana'),
('farmer7@example.com', '$2b$10$example_hash_7', 'farmer', 'Ramesh Gupta', '+91-9876543216', 'Panipat', 'Panipat', 'Haryana'),
('farmer8@example.com', '$2b$10$example_hash_8', 'farmer', 'Kavita Singh', '+91-9876543217', 'Kurukshetra', 'Kurukshetra', 'Haryana'),
('farmer9@example.com', '$2b$10$example_hash_9', 'farmer', 'Vijay Kumar', '+91-9876543218', 'Ambala', 'Ambala', 'Haryana'),
('farmer10@example.com', '$2b$10$example_hash_10', 'farmer', 'Meera Patel', '+91-9876543219', 'Mehsana', 'Mehsana', 'Gujarat'),

-- Field Livestock Workers (FLWs)
('flw1@example.com', '$2b$10$example_hash_11', 'flw', 'Dr. Amit Verma', '+91-9876543220', 'Sonipat', 'Sonipat', 'Haryana'),
('flw2@example.com', '$2b$10$example_hash_12', 'flw', 'Dr. Neha Agarwal', '+91-9876543221', 'Jhajjar', 'Jhajjar', 'Haryana'),
('flw3@example.com', '$2b$10$example_hash_13', 'flw', 'Dr. Ravi Sharma', '+91-9876543222', 'Anand', 'Anand', 'Gujarat'),

-- Admin
('admin@breedscan.ai', '$2b$10$example_hash_14', 'admin', 'System Administrator', '+91-9876543223', 'Delhi', 'Delhi', 'Delhi');

-- Insert sample animals
INSERT INTO animals (owner_id, tag_number, species, breed, gender, date_of_birth, weight) VALUES
(1, 'HR001', 'cattle', 'Gir', 'female', '2020-03-15', 450.50),
(1, 'HR002', 'buffalo', 'Murrah', 'female', '2019-08-22', 520.75),
(2, 'HR003', 'cattle', 'Sahiwal', 'male', '2021-01-10', 380.25),
(3, 'GJ001', 'cattle', 'Gir', 'female', '2020-06-18', 425.00),
(3, 'GJ002', 'cattle', 'Kankrej', 'male', '2019-12-05', 550.80),
(4, 'HR004', 'buffalo', 'Murrah', 'female', '2020-09-30', 485.60),
(5, 'HR005', 'cattle', 'Hariana', 'female', '2021-02-14', 395.40),
(6, 'HR006', 'cattle', 'Tharparkar', 'male', '2020-11-08', 465.90),
(7, 'HR007', 'buffalo', 'Nili-Ravi', 'female', '2019-07-25', 510.30),
(8, 'HR008', 'cattle', 'Red Sindhi', 'female', '2020-04-12', 415.75);

-- Insert sample breed scans
INSERT INTO breed_scans (user_id, animal_id, image_url, predicted_breed, confidence_score, top_predictions, user_feedback, actual_breed) VALUES
(1, 1, '/uploads/scan_001.jpg', 'Gir', 0.9245, '[{"breed": "Gir", "confidence": 0.9245}, {"breed": "Sahiwal", "confidence": 0.0523}, {"breed": "Red Sindhi", "confidence": 0.0232}]', 'confirmed', 'Gir'),
(1, 2, '/uploads/scan_002.jpg', 'Murrah', 0.8876, '[{"breed": "Murrah", "confidence": 0.8876}, {"breed": "Nili-Ravi", "confidence": 0.0987}, {"breed": "Surti", "confidence": 0.0137}]', 'confirmed', 'Murrah'),
(2, 3, '/uploads/scan_003.jpg', 'Sahiwal', 0.7654, '[{"breed": "Sahiwal", "confidence": 0.7654}, {"breed": "Gir", "confidence": 0.1876}, {"breed": "Tharparkar", "confidence": 0.0470}]', 'confirmed', 'Sahiwal'),
(3, 4, '/uploads/scan_004.jpg', 'Gir', 0.9123, '[{"breed": "Gir", "confidence": 0.9123}, {"breed": "Kankrej", "confidence": 0.0654}, {"breed": "Sahiwal", "confidence": 0.0223}]', 'confirmed', 'Gir'),
(3, 5, '/uploads/scan_005.jpg', 'Kankrej', 0.8234, '[{"breed": "Kankrej", "confidence": 0.8234}, {"breed": "Gir", "confidence": 0.1234}, {"breed": "Hariana", "confidence": 0.0532}]', 'confirmed', 'Kankrej');

-- Insert sample heat detection scans
INSERT INTO heat_scans (user_id, animal_id, media_url, media_type, heat_detected, confidence_score, signs_detected, alert_sent) VALUES
(1, 1, '/uploads/heat_001.jpg', 'image', true, 0.8765, '{"swollen_vulva": true, "mucus": true, "mounting_behavior": false}', true),
(2, 3, '/uploads/heat_002.mp4', 'video', false, 0.2345, '{"swollen_vulva": false, "mucus": false, "mounting_behavior": false}', false),
(4, 6, '/uploads/heat_003.jpg', 'image', true, 0.9123, '{"swollen_vulva": true, "mucus": true, "mounting_behavior": true}', true);

-- Insert sample metrics
INSERT INTO metrics (metric_name, metric_value, metric_date, district, state) VALUES
('total_farmers', 15420, CURRENT_DATE, 'Sonipat', 'Haryana'),
('total_flws', 45, CURRENT_DATE, 'Sonipat', 'Haryana'),
('breeds_detected', 1250, CURRENT_DATE, 'Sonipat', 'Haryana'),
('accuracy_rate', 89.5, CURRENT_DATE, 'Sonipat', 'Haryana'),
('conception_rate', 72.3, CURRENT_DATE, 'Sonipat', 'Haryana'),
('total_farmers', 12890, CURRENT_DATE, 'Anand', 'Gujarat'),
('total_flws', 38, CURRENT_DATE, 'Anand', 'Gujarat'),
('breeds_detected', 980, CURRENT_DATE, 'Anand', 'Gujarat'),
('accuracy_rate', 91.2, CURRENT_DATE, 'Anand', 'Gujarat'),
('conception_rate', 75.8, CURRENT_DATE, 'Anand', 'Gujarat');

-- Insert sample user achievements
INSERT INTO user_achievements (user_id, achievement_type, points, badge_level) VALUES
(1, 'breed_expert', 150, 'silver'),
(2, 'heat_detector', 75, 'bronze'),
(3, 'feedback_champion', 200, 'gold'),
(11, 'accuracy_master', 300, 'gold'),
(12, 'community_helper', 125, 'silver');
