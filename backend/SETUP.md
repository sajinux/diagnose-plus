# Diagnose Plus Backend - Setup Instructions

## Prerequisites

Before running the backend server, you need to have PostgreSQL installed and running.

### Install PostgreSQL

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

**Fedora/RHEL:**
```bash
sudo dnf install postgresql postgresql-server
sudo postgresql-setup --initdb
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

**macOS:**
```bash
brew install postgresql
brew services start postgresql
```

## Database Setup

Once PostgreSQL is installed, run the database setup script:

```bash
cd backend
./setup-db.sh
```

This script will:
1. Create the `diagnose_plus` database
2. Set up the database user with proper permissions
3. Run the schema to create all tables
4. Create initial admin user

## Starting the Server

After database setup is complete, start the backend server:

```bash
npm start
```

The server will run on http://localhost:3000

## Testing the API

Test if the server is running:
```bash
curl http://localhost:3000/health
```

You should see a response like:
```json
{
  "success": true,
  "message": "Diagnose Plus API is running",
  "timestamp": "2024-..."
}
```

## Default Admin Credentials

After database setup, you can login with:
- Email: admin@diagnoseplus.lk
- Password: admin123

**IMPORTANT:** Change these credentials in production!

## Troubleshooting

### Database Connection Error

If you see database connection errors, check:
1. PostgreSQL is running: `sudo systemctl status postgresql`
2. Database credentials in `.env` file are correct
3. Database exists: `psql -U postgres -l`

### Port Already in Use

If port 3000 is already in use, change the PORT in `.env` file.
