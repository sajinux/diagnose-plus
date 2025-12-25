# Diagnose Plus Backend API

Backend server for Diagnose Plus - Vehicle Diagnostics Network

## Setup Instructions

### 1. Install Dependencies

First, make sure Node.js is installed, then:

```bash
cd backend
npm install
```

### 2. Set Up PostgreSQL Database

```bash
# Install PostgreSQL (if not already installed)
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database
sudo -u postgres psql
CREATE DATABASE diagnose_plus;
CREATE USER diagnose_app WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE diagnose_plus TO diagnose_app;
\q

# Run database schema
sudo -u postgres psql -d diagnose_plus -f database/schema.sql
```

### 3. Configure Environment Variables

```bash
# Copy example env file
cp .env.example .env

# Edit .env file with your settings
nano .env
```

Update these values:
- `DB_PASSWORD`: Your PostgreSQL password
- `JWT_SECRET`: Generate a random secret key
- `JWT_REFRESH_SECRET`: Generate another random secret key
- `EMAIL_USER` and `EMAIL_PASSWORD`: Your email credentials

### 4. Start the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The API will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new partner
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user info

### Partner Portal
- `GET /api/partner/dashboard` - Get dashboard stats
- `GET /api/partner/profile` - Get partner profile
- `PUT /api/partner/profile` - Update partner profile
- `GET /api/partner/tickets` - List all tickets
- `POST /api/partner/tickets` - Create new ticket
- `GET /api/partner/tickets/:id` - Get ticket details
- `POST /api/partner/tickets/:id/reply` - Reply to ticket

### Admin Dashboard
- `GET /api/admin/partners` - List all partners
- `PUT /api/admin/partners/:id/status` - Update partner status
- `GET /api/admin/leads` - List all leads
- `PUT /api/admin/leads/:id/assign` - Assign lead to partner
- `GET /api/admin/analytics/overview` - Get analytics overview

## Testing the API

### Using curl

```bash
# Health check
curl http://localhost:3000/health

# Register a partner
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "partner@example.com",
    "password": "password123",
    "full_name": "John Doe",
    "business_name": "Auto Care Center",
    "phone": "+94 11 234 5678",
    "district": "Colombo",
    "city": "Colombo 07",
    "address": "123 Galle Road"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "partner@example.com",
    "password": "password123"
  }'
```

### Using Postman

Import the API endpoints into Postman and test each endpoint with the appropriate authentication tokens.

## Project Structure

```
backend/
├── config/
│   ├── database.js      # Database configuration
│   └── auth.js          # Authentication configuration
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── partnerController.js # Partner operations
│   ├── ticketController.js  # Ticket system
│   └── adminController.js   # Admin operations
├── middleware/
│   ├── auth.js          # JWT verification
│   └── validation.js    # Request validation
├── routes/
│   ├── auth.js          # Auth routes
│   ├── partner.js       # Partner routes
│   └── admin.js         # Admin routes
├── database/
│   └── schema.sql       # Database schema
├── server.js            # Main server file
├── package.json         # Dependencies
└── .env.example         # Environment variables template
```

## Security Notes

- Always use HTTPS in production
- Keep JWT secrets secure and rotate them regularly
- Use strong passwords for database users
- Enable rate limiting for authentication endpoints
- Validate and sanitize all user inputs
- Keep dependencies up to date

## Troubleshooting

### Database Connection Issues
- Check if PostgreSQL is running: `sudo systemctl status postgresql`
- Verify database credentials in `.env`
- Ensure database exists: `sudo -u postgres psql -l`

### Port Already in Use
- Change PORT in `.env` file
- Or kill the process using port 3000: `sudo lsof -t -i:3000 | xargs kill`

### Module Not Found Errors
- Run `npm install` again
- Delete `node_modules` and `package-lock.json`, then run `npm install`

## Next Steps

1. Install Node.js and PostgreSQL
2. Run `npm install` to install dependencies
3. Set up the database using `schema.sql`
4. Configure `.env` file
5. Start the server with `npm run dev`
6. Test the API endpoints
7. Build the frontend portal pages to connect to this API
