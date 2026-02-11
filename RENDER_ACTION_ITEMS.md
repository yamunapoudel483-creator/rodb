# 🎯 YOUR RENDER LAUNCH - ACTION ITEMS

**Everything is ready! Follow these steps to launch your website.**

---

## STEP 1: Security Alert ⚠️ (5 minutes)

**YOUR AUTH TOKEN IS EXPOSED IN GIT HISTORY**

Even though `.env` is `.gitignored`, your Turso token was exposed before.

### ✅ ACTION: Rotate Your Turso Token

```bash
# 1. Delete the old token
turso db tokens destroy <paste-old-token-here>

# 2. Create a new token
turso db tokens create rodb-news

# 3. Copy the new token (will display once)
# 4. Use this new token in Render environment variables

# 5. Verify it works
turso db shell rodb-news
# Should connect successfully
```

**Result:** ✓ Old token invalidated, new token ready for Render

---

## STEP 2: Generate Secure Secrets (5 minutes)

Run these commands in your terminal and **SAVE THE OUTPUT**:

```bash
# Open a text editor and paste the commands below
# Copy the entire output (32-character hex strings)

node -e "console.log('JWT_SECRET:', require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log('JWT_REFRESH_SECRET:', require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log('SESSION_SECRET:', require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log('ADMIN_SECRET:', require('crypto').randomBytes(16).toString('hex'))"
```

**Example output:**
```
JWT_SECRET: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6...
JWT_REFRESH_SECRET: f1e2d3c4b5a6z7y8x9w0v1u2t3s4r5q6p7o8n9m0l1k2j3i4h5g...
SESSION_SECRET: z9y8x7w6v5u4t3s2r1q0p9o8n7m6l5k4j3i2h1g0f9e8d7c6b5a4...
ADMIN_SECRET: 9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d...
```

**Save this in a secure location (password manager, encrypted file, etc.)**

**Result:** ✓ 4 secure secrets ready

---

## STEP 3: Verify Turso Database (5 minutes)

### ✅ ACTION: Check Your Database

```bash
# List your databases
turso db list

# You should see: rodb-news

# Show connection details
turso db show rodb-news

# Look for:
# Connection URL: libsql://rodb-news-xxxxx.turso.io
# Organization: (your turso account)

# Test connection
turso db shell rodb-news
# Type: SELECT 1;
# Should return: 1
# Type: .exit
```

**Save these:**
- `TURSO_CONNECTION_URL` (the full URL)
- `TURSO_AUTH_TOKEN` (the new one from Step 1)

**Result:** ✓ Database verified and credentials saved

---

## STEP 4: Commit Your Code (5 minutes)

### ✅ ACTION: Push to GitHub

```bash
cd /home/arcgg/rodb

# Verify nothing secret is included
git status

# Add the new deployment files
git add render.yaml RENDER_*.md RENDER_GOTCHAS.md verify-render.sh

# Commit
git commit -m "Prepare for Render deployment - add deployment guides and config"

# Push to GitHub
git push origin main

# Verify it's pushed
git log --oneline | head -5
```

**Result:** ✓ All files pushed to GitHub

---

## STEP 5: Create Render Service (10 minutes)

### ✅ ACTION: Deploy to Render

1. **Go to https://render.com**
2. **Sign in** (or create account)
3. **Click "New +"** button (top right)
4. **Select "Web Service"**
5. **Click "Connect account"** → **GitHub**
6. **Authorize** Render to access GitHub
7. **Select your repository**: Look for `rodb` or `gneshpoudel/rodb`
8. **Click "Connect"**

---

## STEP 6: Configure the Service (10 minutes)

### ✅ ACTION: Fill in Service Details

You'll see a form. Fill in these values:

| Field | Value |
|-------|-------|
| **Name** | `rodb-news` |
| **Environment** | `Node` |
| **Region** | `Oregon` (Free tier only) |
| **Branch** | `main` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |

**Click "Create Web Service"**

Render will start building. ⏳ Wait about 2-3 minutes...

**Result:** ✓ Build in progress

---

## STEP 7: Add Environment Variables (10 minutes)

While Render is building, follow these steps:

1. **In your Render dashboard**, go to your service: `rodb-news`
2. **Click "Settings"** tab
3. **Scroll to "Environment Variables"**
4. **Click "Add Environment Variable"** button

Add each variable and click "Add":

```
NODE_ENV                    production
PORT                        3000
LOG_LEVEL                   info

TURSO_CONNECTION_URL        libsql://rodb-news-xxxxx.turso.io
TURSO_AUTH_TOKEN           (paste your new token from Step 1)

JWT_SECRET                  (paste from Step 2)
JWT_REFRESH_SECRET          (paste from Step 2)
SESSION_SECRET              (paste from Step 2)
ADMIN_SECRET                (paste from Step 2)

PASSWORD_MIN_LENGTH         8
PASSWORD_REQUIRE_UPPERCASE  true
PASSWORD_REQUIRE_LOWERCASE  true
PASSWORD_REQUIRE_NUMBER     true
PASSWORD_REQUIRE_SPECIAL    true
```

**After adding all variables:**
- Click **Deploy** or **Save**
- Render will redeploy with the new variables

**Result:** ✓ Environment variables configured

---

## STEP 8: Verify Deployment (5 minutes)

### ✅ ACTION: Check Your Live Site

1. **Go to your Render dashboard**
2. **Look for "Your service is live at:"** - This is your URL
3. **Copy the URL** (looks like: `https://rodb-news.onrender.com`)

### Test the Health Endpoint

```bash
# Replace the URL with your actual Render URL
curl https://rodb-news.onrender.com/api/health

# Should return something like:
# {"status":"healthy","timestamp":"2026-02-11T...","uptime":123.456,"environment":"production"}
```

**Result:** ✓ Website is live!

---

## STEP 9: Access Your Admin Panel (5 minutes)

### ✅ ACTION: Log in to Admin

1. **Open your browser**
2. **Go to:** `https://rodb-news.onrender.com/admin`
3. **Login with:**
   - Username: `admin`
   - Password: `admin123`

You should see the admin dashboard!

**Result:** ✓ Admin panel working

---

## STEP 10: Change Default Admin Password (5 minutes) ⚠️

### ✅ ACTION: Secure Your Admin Account

**IMPORTANT: The default password is public knowledge!**

1. **In admin panel**, go to **Settings** or **Users**
2. **Find your admin user**
3. **Change password** to something strong
4. **Save**

You can also create a new admin user and delete the default one.

**Result:** ✓ Admin account secured

---

## 🎉 LAUNCH COMPLETE!

Your website is now live on Render!

### What's Next?

- [ ] **Test everything** - Try creating articles, uploading images, etc.
- [ ] **Monitor logs** - Check Render dashboard for any issues
- [ ] **Set up custom domain** (optional)
  - Buy a domain (Namecheap, GoDaddy, etc.)
  - Go to Render dashboard → Settings → Custom Domain
  - Update DNS records as shown
- [ ] **Set up email notifications** (optional)
  - Configure alerts in Render dashboard
- [ ] **Upload logo and media**
  - Go to admin → Settings
  - Upload organization logo
  - Create articles with images

### Important Notes

**Your Site:**
- **URL:** Check your Render dashboard for the exact URL
- **Database:** Using Turso (cloud SQLite) - data is persistent ✓
- **Uptime:** Free tier may sleep after 15 mins (first request will be slow)
- **Monitoring:** Health endpoint: `/api/health`

**Limitations:**
- Uploaded files disappear after service restart (use S3 later)
- Free tier may be slower than paid tier
- Consider upgrading to Paid plan ($7+/month) for better performance

---

## ❓ Troubleshooting

### Website won't load
- Check Render logs (Logs tab in dashboard)
- Verify all environment variables are set
- Try: `curl https://your-url/api/health`

### Can't login to admin
- Check admin user exists in database
- Try default: admin / admin123
- Check database connection in Render logs

### Database errors
- Verify Turso token is valid
- Check connection URL format
- Try locally: `turso db shell rodb-news`

### Still having issues?
- See **RENDER_GOTCHAS.md** for detailed troubleshooting
- See **RENDER_DEPLOYMENT.md** for full guide
- Check Render support: https://support.render.com

---

## 📞 Quick Commands Reference

```bash
# Check Turso database
turso db shell rodb-news

# View Render logs (requires Render CLI)
render logs --service-id <your-service-id>

# Test health endpoint
curl https://your-url/api/health

# Git status before deployment
git status
git log --oneline | head
```

---

## ✅ FINAL CHECKLIST

Before you're done:

- [ ] Turso token rotated (old one destroyed)
- [ ] Secrets generated and saved securely
- [ ] Code pushed to GitHub
- [ ] Render service created
- [ ] All environment variables added
- [ ] Build completed successfully
- [ ] Website is live and accessible
- [ ] Admin login works
- [ ] Default admin password changed
- [ ] Articles can be created/viewed

---

## 🚀 You Did It!

Your RoDB news website is now live on Render!

**Next:** Tell your team about the live site, start publishing articles, and enjoy your new platform!

Questions? Check the documentation files:
- `RENDER_DEPLOYMENT.md` - Full deployment guide
- `RENDER_GOTCHAS.md` - Common issues and solutions
- `RENDER_QUICK_START.md` - Quick reference card

---

**Deployed on:** February 2026
**Platform:** Render + Turso
**Status:** ✅ LIVE
