# Diagnose Plus - Vehicle Diagnostics Network

Deploy this full-stack web application (Frontend + Backend + Database) for your automotive diagnostic business in Sri Lanka.

## 📁 Project Structure

```
diagnose-plus/
├── index.html              # Home page
├── blog.html              # Blog & Knowledge Base
├── services.html          # Services showcase
├── dealer-locator.html    # Partner finder
├── become-partner.html    # Partner application
├── login.html            # Partner login
├── css/                  # Stylesheets
├── js/                   # Frontend JavaScript
├── assets/               # Images & media
├── backend/              # Node.js + Express API
│   ├── server.js
│   ├── package.json
│   ├── .env
│   ├── config/           # Database & Auth config
│   ├── controllers/      # Business logic
│   ├── routes/          # API endpoints
│   ├── models/          # Data models
│   ├── middleware/      # Auth & validation
│   └── database/        # Schema & migrations
└── README.md
```

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 14+
- PostgreSQL 12+
- Python 3+

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/yourusername/diagnose-plus.git
cd diagnose-plus
```

2. **Setup Backend:**
```bash
cd backend
npm install
```

3. **Setup Database:**
```bash
./setup-db.sh
```

4. **Start Backend:**
```bash
npm start
# API runs on http://localhost:3000
```

5. **In another terminal, start Frontend:**
```bash
python3 -m http.server 8000
# Frontend runs on http://localhost:8000
```

6. **Access the website:**
```
http://localhost:8000
```

## 📊 Features

- ✅ **Dealer Locator** - Interactive map to find partner garages
- ✅ **Remote Diagnostics** - Real-time vehicle analysis
- ✅ **Blog & Articles** - Vehicle maintenance tips
- ✅ **Partner Network** - Join as automotive partner
- ✅ **Admin Dashboard** - Manage partners and tickets
- ✅ **Bilingual Support** - Sinhala & English
- ✅ **Responsive Design** - Mobile, tablet, desktop

## 🛠️ Technology Stack

**Frontend:**
- HTML5, CSS3, JavaScript (Vanilla)
- Google Maps API
- Responsive Grid Layout

**Backend:**
- Node.js + Express.js
- PostgreSQL Database
- JWT Authentication
- RESTful API

## 🔐 Environment Variables

Create `.env` file in `backend/` directory:

```dotenv
# Server
NODE_ENV=development
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=diagnose_plus
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=15m

# Frontend
FRONTEND_URL=http://localhost:8000
```

## 📚 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/blog` | Get all blog posts |
| GET | `/api/blog/:id` | Get single blog post |
| GET | `/api/partners` | List all partners |
| POST | `/api/auth/register` | Register partner |
| POST | `/api/auth/login` | Login partner |
| GET | `/api/health` | Health check |

## 🌐 Deployment

### Deploy on Render.com (Recommended)

1. **Push code to GitHub:**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/diagnose-plus.git
git branch -M main
git push -u origin main
```

2. **Go to Render.com and:**
   - Click "New +" → Web Service
   - Connect your GitHub repo
   - Set Build Command: `cd backend && npm install`
   - Set Start Command: `npm start`
   - Add Environment Variables from `.env`
   - Click "Deploy"

3. **Get your live URL** (e.g., `https://diagnose-plus.onrender.com`)

4. **Update Frontend Config:**
   Edit `js/config.js`:
   ```javascript
   API_BASE_URL: 'https://your-app.onrender.com'
   ```

## 📱 Contact & Support

- Email: info@diagnoseplus.lk
- Phone: +94 XX XXX XXXX
- WhatsApp: Available

## 📄 License

ISC License - See LICENSE file for details

## 👥 Author

Diagnose Plus Team

---

**Last Updated:** December 2025
