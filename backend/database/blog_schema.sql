-- Blog Posts Table
CREATE TABLE IF NOT EXISTS blog_posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    image_emoji VARCHAR(10) NOT NULL,
    author VARCHAR(100) DEFAULT 'Admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed Data (6 Posts)
INSERT INTO blog_posts (title, category, excerpt, content, image_emoji, author, created_at)
VALUES 
(
    'Essential Vehicle Maintenance Tips', 
    'Maintenance', 
    'ඔබගේ වාහනය දිගු කාලයක් හොඳ තත්ත්වයේ පවත්වා ගැනීමට අවශ්‍ය මූලික නඩත්තු උපදෙස්...', 
    'Regular maintenance is key to prolonging the life of your vehicle. This includes oil changes every 5,000 to 7,500 miles, checking tire pressure monthly, and inspecting brakes. For Sri Lankan weather conditions, we recommend checking your cooling system frequently to prevent overheating. Visit our partner garages for a comprehensive 21-point checkup to ensure everything is in top shape.', 
    '🔧', 
    'Admin', 
    '2024-12-20'
),
(
    'Understanding Modern Diagnostic Tools', 
    'Technology', 
    'නවීන වාහන diagnostic tools භාවිතා කරමින් ගැටලු හඳුනාගන්නේ කෙසේද යන්න පිළිබඳව...', 
    'Modern vehicles are equipped with sophisticated On-Board Diagnostics (OBD) systems. At Diagnose Plus, our partners use high-end scanners that interface with your vehicle''s Engine Control Unit (ECU) to pinpoint exact faults. This eliminates guesswork and saves you money on unnecessary repairs. Learn how a simple scan can detect hidden issues before they become major problems.', 
    '🚗', 
    'Admin', 
    '2024-12-18'
),
(
    'Choosing the Right Spare Parts', 
    'Parts', 
    'ඔබගේ වාහනය සඳහා genuine සහ quality spare parts තෝරා ගන්නේ කෙසේද...', 
    'The market is flooded with counterfeit parts that can damage your vehicle in the long run. Always opt for genuine or high-quality OEM (Original Equipment Manufacturer) parts. Diagnose Plus partners have access to a verified network of suppliers, ensuring that every part installed in your vehicle meets safety and performance standards. Never compromise on brakes, suspension, or engine components.', 
    '⚙️', 
    'Admin', 
    '2024-12-15'
),
(
    'Hybrid Battery Care & Longevity', 
    'Hybrid', 
    'හයිබ්‍රිඩ් වාහනයක බැටරියේ ආයු කාලය වැඩි කරගැනීමට කළ යුතු දේවල්...', 
    'Hybrid batteries are expensive. To maximize their life, ensure the cooling fan filter is clean and avoid leaving the car unused for long periods. Our specialty partners offer hybrid health checks and cell balancing services. Understanding the state of charge and avoiding deep discharges can add years to your hybrid battery lifecycle.', 
    '🔋', 
    'Specialist', 
    '2024-12-23'
),
(
    'Preparing Your Car for the Monsoon', 
    'Safety', 
    'වැසි කාලයේදී ඔබේ වාහනයේ ආරක්ෂාව තහවුරු කරගන්නේ කෙසේද?', 
    'Sri Lanka''s monsoon season brings heavy rains and flooded roads. Ensure your wiper blades are effective, your headlights are clear, and your tires have adequate tread depth (at least 3mm for wet weather). Check for any water leaks in the cabin and ensure your seals are intact. A quick pre-monsoon inspection at a Diagnose Plus center can keep you safe on slippery roads.', 
    '🌧️', 
    'Admin', 
    '2024-12-22'
),
(
    'The Future of Electric Vehicles in SL', 
    'Future', 
    'ශ්‍රී ලංකාවේ විදුලි වාහන (EV) අනාගතය සහ ඒ සඳහා අප සූදානම් විය යුතු ආකාරය...', 
    'Electric Vehicles are the future of sustainable transport. As the infrastructure grows in Sri Lanka, we are training our partners to handle EV diagnostics and repairs safely. From battery management systems to high-voltage components, Diagnose Plus is at the forefront of the EV revolution, ensuring technicians are certified and equipped for the next generation of cars.', 
    '⚡', 
    'Expert', 
    '2024-12-24'
);
