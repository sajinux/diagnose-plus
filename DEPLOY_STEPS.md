# 🚀 Step-by-Step Deployment Guide

## **Step 1: Create GitHub Account & Repository**

1. Go to https://github.com
2. Sign up (free account)
3. Create new repository:
   - Name: `diagnose-plus`
   - Description: `Vehicle Diagnostics Network Platform`
   - Public (so Render can access it)
   - ✅ Add .gitignore (already done)
   - ✅ Add README (already done)
   - Click **Create repository**

4. Copy your repository URL (will look like):
   ```
   https://github.com/yourusername/diagnose-plus.git
   ```

---

## **Step 2: Push Your Code to GitHub**

Run these commands on your laptop:

```bash
cd /home/sajith/perihelion-perseverance

# Add your GitHub repository
git remote add origin https://github.com/yourusername/diagnose-plus.git

# Rename branch to main
git branch -M main

# Push code to GitHub
git push -u origin main
```

**Output should show:**
```
Enumerating objects: 52, done.
...
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

---

## **Step 3: Setup Render.com Account**

1. Go to https://render.com
2. Sign up (free account using GitHub)
3. Click **GitHub** button to authorize
4. Select your `diagnose-plus` repository
5. Click **Connect**

---

## **Step 4: Deploy Backend on Render**

1. On Render dashboard, click **New +** → **Web Service**
2. Select your `diagnose-plus` repository
3. Fill in deployment details:

   | Field | Value |
   |-------|-------|
   | **Name** | `diagnose-plus-api` |
   | **Environment** | `Node` |
   | **Build Command** | `cd backend && npm install` |
   | **Start Command** | `npm start` |
   | **Plan** | Free |

4. **Add Environment Variables** (click "Advanced"):
   ```
   NODE_ENV = production
   PORT = 3000
   DB_HOST = [you'll get this from PostgreSQL addon]
   DB_PORT = 5432
   DB_NAME = diagnose_plus
   DB_USER = postgres
   DB_PASSWORD = [create strong password]
   JWT_SECRET = [generate: $(openssl rand -base64 32)]
   FRONTEND_URL = https://yourdomain.com
   ```

5. Click **Create Web Service**

6. Wait for deployment (2-3 minutes)

7. Copy your API URL (will look like):
   ```
   https://diagnose-plus-api.onrender.com
   ```

---

## **Step 5: Add PostgreSQL Database**

1. On Render dashboard, click **New +** → **PostgreSQL**
2. Fill in:
   - **Name:** `diagnose-plus-db`
   - **Database:** `diagnose_plus`
   - **User:** `postgres`
   - **Password:** [same as above]
   - **Plan:** Free

3. Click **Create Database**

4. Wait for database to initialize
5. Copy the **Internal Database URL**
6. Update your Render Web Service environment variables with DB details

---

## **Step 6: Run Database Setup on Render**

Once database is created, you need to initialize the schema:

1. Use Render PostgreSQL terminal or run locally:
```bash
# Connect to your remote database
psql postgresql://postgres:password@your-db-host:5432/diagnose_plus < backend/database/schema.sql
psql postgresql://postgres:password@your-db-host:5432/diagnose_plus < backend/database/blog_schema.sql
```

Or use Render's PostgreSQL dashboard to run SQL directly.

---

## **Step 7: Deploy Frontend on Vercel (Free CDN)**

1. Go to https://vercel.com
2. Sign up (free, use GitHub)
3. Click **Import Project**
4. Select your `diagnose-plus` repository
5. Configure:
   - **Root Directory:** `.` (root)
   - **Build Command:** Skip or leave empty
   - **Output Directory:** `.`

6. Click **Deploy**

7. Get your frontend URL:
   ```
   https://diagnose-plus.vercel.app
   ```

---

## **Step 8: Update Configuration for Live**

### **Update Frontend Config:**

Edit `js/config.js` and change:
```javascript
const CONFIG = {
    API_BASE_URL: 'https://diagnose-plus-api.onrender.com',
    // ... rest of config
};
```

### **Commit and Push:**
```bash
git add js/config.js
git commit -m "Update API URL for production"
git push
```

Your Vercel deployment will automatically update! ✅

---

## **Step 9: Buy a Domain (Optional)**

1. Go to Namecheap.com or GoDaddy
2. Search for domain (e.g., `diagnoseplus.lk`)
3. Buy for 1 year (~$2-10)
4. Point to Vercel:
   - Add DNS records provided by Vercel
   - Wait 24 hours for DNS to propagate

---

## **✅ Your Project is Live!**

### **URLs After Deployment:**

| Component | URL |
|-----------|-----|
| **Frontend** | `https://diagnose-plus.vercel.app` |
| **API** | `https://diagnose-plus-api.onrender.com/api/blog` |
| **Custom Domain** | `https://your-domain.lk` |
| **Admin** | `https://your-domain.lk/partner-dashboard.html` |

---

## **🔍 Troubleshooting**

### **Blog posts not showing:**
```bash
# Check API is running
curl https://diagnose-plus-api.onrender.com/api/blog

# Check database logs on Render dashboard
```

### **Database connection error:**
1. Check environment variables on Render
2. Verify DB is initialized with schema
3. Check PostgreSQL password is correct

### **Frontend can't reach API:**
1. Verify `API_BASE_URL` in `js/config.js`
2. Check CORS is enabled in `backend/server.js`
3. Verify API endpoint is live

---

## **📝 Quick Reference**

### **Key Environment Variables:**
```dotenv
# Production values
NODE_ENV=production
DB_HOST=your-render-db-host
DB_PASSWORD=strong-password-here
JWT_SECRET=generate-random-key
FRONTEND_URL=https://your-domain.com
```

### **Database Connection String:**
```
postgresql://postgres:password@your-db-host:5432/diagnose_plus
```

### **Deploy New Changes:**
```bash
git add .
git commit -m "Your message"
git push
```
Vercel & Render automatically redeploy! 🚀

---

## **📧 Contact for Help**

If you have issues:
1. Check Render/Vercel logs (Deployment tab)
2. Verify environment variables
3. Check database is initialized
4. Make sure PostgreSQL addon is running

---

**Congratulations! Your project is now live for your clients! 🎉**
