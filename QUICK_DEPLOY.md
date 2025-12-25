# 🎯 QUICK START - Deploy Your Project in 15 Minutes

## **What You Need:**
- ✅ GitHub account (free) - https://github.com
- ✅ Render account (free) - https://render.com  
- ✅ Vercel account (free) - https://vercel.com

---

## **FOLLOW THESE 5 STEPS:**

### **1️⃣ GitHub - Upload Your Code (3 min)**

```bash
# On your laptop terminal:
cd /home/sajith/perihelion-perseverance

# Add your GitHub URL (replace with your username)
git remote add origin https://github.com/YOUR_USERNAME/diagnose-plus.git
git branch -M main
git push -u origin main
```

**✅ Now your code is on GitHub**

---

### **2️⃣ Render - Deploy Backend API (5 min)**

1. Go to https://render.com
2. Sign up with GitHub
3. Click **New +** → **Web Service**
4. Select your `diagnose-plus` repository
5. Fill in:
   - Name: `diagnose-plus-api`
   - Build: `cd backend && npm install`
   - Start: `npm start`
   - Plan: **Free**

6. Click **Advanced** and add these environment variables:
   ```
   NODE_ENV = production
   JWT_SECRET = abc123def456ghi789jkl
   ```

7. Click **Deploy** → Wait 2-3 minutes
8. **Copy your API URL** - looks like: `https://diagnose-plus-api.onrender.com`

**✅ Your backend is now LIVE!**

---

### **3️⃣ Update Code with Live API URL (2 min)**

```bash
# Edit the config file
cd /home/sajith/perihelion-perseverance
```

Edit `js/config.js` - Change line with `API_BASE_URL`:
```javascript
API_BASE_URL: 'https://diagnose-plus-api.onrender.com',
```

Then push:
```bash
git add js/config.js
git commit -m "Update API URL for production"
git push
```

---

### **4️⃣ Vercel - Deploy Frontend (3 min)**

1. Go to https://vercel.com
2. Sign up with GitHub
3. Click **Import Project**
4. Select `diagnose-plus` repository
5. Click **Deploy**
6. **Copy your Frontend URL** - looks like: `https://diagnose-plus.vercel.app`

**✅ Your frontend is now LIVE!**

---

### **5️⃣ Optional - Buy Domain (2 min)**

1. Go to https://namecheap.com
2. Search for domain (e.g., `diagnoseplus.lk`) - ~$2-10/year
3. Buy it
4. Point to Vercel URL

---

## **🎉 YOU'RE DONE!**

### **Share with your client:**
```
🌐 Website: https://diagnose-plus.vercel.app
📱 Works on all devices!
✅ Live and ready to use!
```

---

## **⚠️ IMPORTANT - Database Setup**

Your blog posts will NOT show until you initialize the database:

### **Option A: Use Render PostgreSQL**
1. On Render, add PostgreSQL database
2. Use the provided dashboard to run SQL files
3. Run `backend/database/schema.sql`
4. Run `backend/database/blog_schema.sql`

### **Option B: Local Database (Easier)**
If your local PostgreSQL is already set up with blog posts:
- They'll automatically sync when needed
- Just ensure backend can connect to your local DB from cloud

---

## **📞 Need Help?**

### **Blog posts not showing:**
```bash
# Check your API
curl https://your-api-url.onrender.com/api/blog
```

### **API not responding:**
1. Go to Render dashboard
2. Check "Logs" tab for errors
3. Verify environment variables

### **Frontend shows errors:**
1. Open DevTools (F12)
2. Check Console tab
3. Usually missing API_BASE_URL

---

## **✅ Verify Everything Works:**

1. **Open:** https://diagnose-plus.vercel.app
2. **Go to:** Blog page
3. **Should see:** 6 blog posts loading
4. **Click:** "Read More" on any post
5. **Should see:** Full article in modal

---

## **🚀 NEXT STEPS FOR CLIENTS:**

Once live, share:
- ✅ Website URL
- ✅ Admin login page (if using partner dashboard)
- ✅ How to find dealers (Google Maps)
- ✅ How to apply as partner

---

## **📱 Share This Link with Your Client:**

```
Visit: https://your-domain.com
Or: https://diagnose-plus.vercel.app

All features available:
✓ Find partner garages
✓ View services  
✓ Read blog articles
✓ Apply as partner
✓ Mobile friendly
✓ Works offline for basic features
```

---

**That's it! Your project is live! 🎉**

Questions? Check DEPLOY_STEPS.md for detailed guide.
