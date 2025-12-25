# 🎯 EXACT COMMANDS TO GO LIVE

## **STEP 1: Add GitHub Remote & Push Code**

Copy and paste this entire block into your terminal:

```bash
cd /home/sajith/perihelion-perseverance

# Replace YOUR_USERNAME with your actual GitHub username
git remote add origin https://github.com/YOUR_USERNAME/diagnose-plus.git

git branch -M main

git push -u origin main
```

**After running:**
- You'll be asked to login to GitHub
- Code will upload (takes 10-30 seconds)
- You'll see: `Branch 'main' set up to track remote branch 'main' from 'origin'.`

---

## **STEP 2: Create Free Accounts (Do These Now)**

### **GitHub:**
1. Go to https://github.com/signup
2. Create account (remember your username!)
3. Done!

### **Render:**
1. Go to https://render.com
2. Click "Get Started"
3. Sign up with GitHub (easiest)
4. Authorize Diagnose Plus repo
5. Done!

### **Vercel:**
1. Go to https://vercel.com
2. Click "Sign Up"
3. Sign up with GitHub
4. Authorize repo
5. Done!

---

## **STEP 3: Deploy on Render (Backend)**

1. Open https://render.com/dashboard
2. Click **New +** → **Web Service**
3. Select your `diagnose-plus` repository
4. Copy these exact values:

```
Name:           diagnose-plus-api
Environment:    Node
Region:         Singapore (or nearest)
Build Command:  cd backend && npm install
Start Command:  npm start
Plan:           Free
```

5. Scroll to **Advanced** section
6. Click **Add Environment Variable** and add:

```
Name:  NODE_ENV
Value: production
```

7. Add more variables:

```
Name:  JWT_SECRET
Value: abc123def456ghi789jkl0123456
```

8. Click **Create Web Service**
9. Wait 2-3 minutes for deployment
10. When complete, copy your URL (will look like):
    ```
    https://diagnose-plus-api.onrender.com
    ```

---

## **STEP 4: Update Your Code**

1. Open file: `/home/sajith/perihelion-perseverance/js/config.js`
2. Find this line:
   ```javascript
   API_BASE_URL: 'http://localhost:3000',
   ```
3. Replace with (using YOUR API URL):
   ```javascript
   API_BASE_URL: 'https://diagnose-plus-api.onrender.com',
   ```
4. Save file
5. Push to GitHub:

```bash
cd /home/sajith/perihelion-perseverance
git add js/config.js
git commit -m "Update API URL for production"
git push
```

---

## **STEP 5: Deploy on Vercel (Frontend)**

1. Open https://vercel.com/dashboard
2. Click **Import Project**
3. Select **Import Git Repository**
4. Paste your repo URL: `https://github.com/YOUR_USERNAME/diagnose-plus`
5. Click **Continue**
6. Leave everything default, click **Deploy**
7. Wait 1-2 minutes
8. Copy your frontend URL (will look like):
   ```
   https://diagnose-plus.vercel.app
   ```

---

## **STEP 6: Test Everything Works**

### **Check Backend is Running:**
```bash
# Open in browser:
https://diagnose-plus-api.onrender.com/health

# Should show:
{"success":true,"message":"Diagnose Plus API is running",...}
```

### **Check Frontend is Running:**
```bash
# Open in browser:
https://diagnose-plus.vercel.app

# Should show:
Your website!
```

### **Check Blog Posts Load:**
1. Go to: `https://diagnose-plus.vercel.app/blog.html`
2. Should show: 6 blog posts
3. Click "Read More" on any post
4. Should open in modal with full article

---

## **✅ YOU'RE LIVE!**

Share these URLs with your client:

```
Website:  https://diagnose-plus.vercel.app
Backend:  https://diagnose-plus-api.onrender.com
```

Or if you buy a domain, use that instead.

---

## **📝 OPTIONAL: Buy a Domain**

1. Go to https://namecheap.com
2. Search for your domain (e.g., `diagnoseplus.lk`)
3. Buy for 1 year (~$2-10)
4. In Namecheap, go to Manage DNS
5. Add these records provided by Vercel:
   - CNAME: www → cname.vercel-dns.com
   - A: @ → 76.76.19.165
6. Wait 24 hours for DNS to update
7. Your domain now shows: `https://diagnoseplus.lk`

---

## **🐛 If Something Goes Wrong:**

### **Backend not responding:**
1. Go to Render dashboard
2. Click on your web service
3. Go to "Logs" tab
4. Look for red errors
5. Check environment variables match
6. Click "Manual Deploy" button

### **Blog posts not showing:**
1. Check API is responding: https://your-api.onrender.com/api/blog
2. Check Render logs for database errors
3. Make sure PostgreSQL addon is active

### **Frontend shows blank:**
1. Open DevTools (F12)
2. Check Console tab for errors
3. Check Network tab - see if API calls work
4. Verify API_BASE_URL in js/config.js

---

## **💾 SAVE THESE IMPORTANT URLS:**

```
GitHub Repo:    https://github.com/YOUR_USERNAME/diagnose-plus
Render Backend: https://diagnose-plus-api.onrender.com
Vercel Frontend: https://diagnose-plus.vercel.app
Your Domain:    https://diagnoseplus.lk (if you buy one)
```

---

## **🚀 That's It!**

Your project is now live and accessible worldwide! 🌍

Your clients can visit from any country on any device.

---

**Questions? Read the detailed guides:**
- QUICK_DEPLOY.md - Simple 5-step guide
- DEPLOY_STEPS.md - Detailed step-by-step
- DEPLOYMENT.md - Full documentation
