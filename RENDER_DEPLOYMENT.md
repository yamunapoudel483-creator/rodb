# 🚀 Render Deployment Guide - RoDB News Platform

**Last Updated:** February 2026  
**Status:** Ready for Production ✅

---

## Table of Contents
1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Step-by-Step Deployment](#step-by-step-deployment)
3. [Environment Variables](#environment-variables)
4. [Troubleshooting](#troubleshooting)
5. [Post-Deployment](#post-deployment)

---

## Pre-Deployment Checklist

### ✅ Before You Start
- [ ] You have a Render account (free tier available at render.com)
- [ ] Your GitHub repository is public or Render has access
- [ ] You have Turso database credentials (URL + Auth Token)
- [ ] Node.js 18+ is available locally for testing
- [ ] All code is committed to GitHub: `git push origin main`

### ✅ Local Testing (Do This First!)
```bash
# Install dependencies
npm install

# Start locally to verify
npm start

# Test endpoints in browser/Postman
curl http://localhost:3000/api/health
```

**Expected response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-02-11T...",
  "uptime": 123.456,
  "environment": "production"
}
```

---

## Step-by-Step Deployment

### ⚠️ CRITICAL: Generate Secure Secrets FIRST

Open your terminal and generate secure keys:

```bash
# Generate JWT Secret (copy the output)
node -e "console.log('JWT_SECRET:', require('crypto').randomBytes(32).toString('hex'))"

# Generate JWT Refresh Secret (copy the output)
node -e "console.log('JWT_REFRESH_SECRET:', require('crypto').randomBytes(32).toString('hex'))"

# Generate Session Secret (copy the output)
node -e "console.log('SESSION_SECRET:', require('crypto').randomBytes(32).toString('hex'))"

# Generate Admin Secret (copy the output)
node -e "console.log('ADMIN_SECRET:', require('crypto').randomBytes(16).toString('hex'))"
```

**📌 Save all four values in a secure location!**

---

### Step 1: Verify Turso Database is Set Up

```bash
# If you haven't created a Turso database yet:
turso auth login  # You'll be redirected to authenticate
turso db create rodb-news  # Create database
turso db show rodb-news  # Show connection details
turso db tokens create rodb-news  # Create authentication token
```

**You need:**
- `TURSO_CONNECTION_URL` - Example: `libsql://rodb-news-xxx.turso.io`
- `TURSO_AUTH_TOKEN` - Your auth token (save securely)

---

### Step 2: Create Render Web Service

1. Go to [render.com](https://render.com)
2. Click **New +** button (top right)
3. Select **Web Service**
4. Click **Connect account** → **GitHub** (if not already connected)
5. Authorize Render to access GitHub
6. Find and select your repository: `rodb`
7. Click **Connect**

---

### Step 3: Configure the Web Service

Fill in the following fields:

| Field | Value |
|-------|-------|
| **Name** | `rodb-news` (or your preferred name) |
| **Environment** | `Node` |
| **Region** | `Oregon` (Free tier only in Oregon) |
| **Branch** | `main` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |

---

### Step 4: Set Environment Variables

After clicking **Create Web Service**, you'll see **Environment** section:

1. Scroll to **Environment Variables**
2. Click **Add Environment Variable**
3. Add each variable:

```
NODE_ENV              production
PORT                  3000
LOG_LEVEL             info
TURSO_CONNECTION_URL  libsql://rodb-news-xxxxx.turso.io  (from Step 1)
TURSO_AUTH_TOKEN      your-turso-token-here  (from Step 1)
JWT_SECRET            <paste from generated secret>
JWT_REFRESH_SECRET    <paste from generated secret>
SESSION_SECRET        <paste from generated secret>
ADMIN_SECRET          <paste from generated secret>
PASSWORD_MIN_LENGTH   8
PASSWORD_REQUIRE_UPPERCASE  true
PASSWORD_REQUIRE_LOWERCASE  true
PASSWORD_REQUIRE_NUMBER     true
PASSWORD_REQUIRE_SPECIAL    true
```

---

### Step 5: Deploy

1. Click **Create Web Service**
2. Render will start building (watch the logs)
3. Wait for "Your service is live at" message
4. Check the URL provided

---

## Environment Variables Reference

### Required Variables (Must Set)
```
TURSO_CONNECTION_URL    Database connection string
TURSO_AUTH_TOKEN        Database authentication token
JWT_SECRET              Secure JWT signing key (32+ chars)
JWT_REFRESH_SECRET      Refresh token signing key (32+ chars)
SESSION_SECRET          Session secret key (32+ chars)
```

### Recommended Variables
```
NODE_ENV=production
PORT=3000
LOG_LEVEL=info
ADMIN_SECRET=your-admin-password
```

### Optional Variables
```
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
LOGIN_RATE_LIMIT_WINDOW_MS=900000
LOGIN_RATE_LIMIT_MAX_ATTEMPTS=5
UPLOAD_MAX_FILE_SIZE=10485760
PASSWORD_MIN_LENGTH=8
PASSWORD_REQUIRE_UPPERCASE=true
PASSWORD_REQUIRE_LOWERCASE=true
PASSWORD_REQUIRE_NUMBER=true
PASSWORD_REQUIRE_SPECIAL=true
```

---

## Troubleshooting

### ❌ Problem: "Build Failed"

**Check the build logs:**
1. Go to your Render dashboard
2. Click on your service
3. Click **Logs** tab
4. Look for error messages

**Common fixes:**
- Missing `node_modules/` - Run `npm install` locally first
- Node version mismatch - Check engines in package.json (should be 18.x)
- Missing environment variable - Check all required vars are set

---

### ❌ Problem: "Service Won't Start" 

**Check runtime logs:**
1. Go to **Logs** tab
2. Look for error messages

**Common causes:**
- Missing Turso database credentials
- Database connection timeout
- Invalid JWT_SECRET length (must be min 32 chars)

**Fix:**
```bash
# Verify locally
npm start
```

---

### ❌ Problem: "502 Bad Gateway"

**Likely causes:**
- Server crashed
- Port binding issue
- Database connection lost

**Check logs:**
1. Click **Logs** tab
2. Check for restart messages
3. Verify environment variables are set

---

### ❌ Problem: "Database Connection Refused"

**Check Turso setup:**
1. Verify `TURSO_CONNECTION_URL` is correct format
2. Verify `TURSO_AUTH_TOKEN` is valid
3. Try connecting locally first:
   ```bash
   turso db shell rodb-news
   ```

---

### ❌ Problem: "Can't Upload Files"

**Render has ephemeral filesystem** (files deleted on restart)

**Solution:**
- Configure cloud storage (AWS S3, Cloudinary, etc.)
- For now, files persist only until service restarts
- Plan S3 integration for production

---

## Post-Deployment

### ✅ Verify Your Site is Live

1. Get your service URL from Render dashboard
2. Test the following endpoints:

```bash
# Health check
curl https://your-service.onrender.com/api/health

# Get articles
curl https://your-service.onrender.com/api/articles

# Admin login
curl -X POST https://your-service.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

---

### ✅ Configure Custom Domain (Optional)

1. Go to your Render service
2. Click **Settings**
3. Scroll to **Custom Domain**
4. Enter your domain
5. Update your domain's DNS records as shown

---

### ✅ Set Up Automatic Deployments

1. Go to **Settings**
2. Scroll to **Auto-Deploy**
3. Select **Yes** (deploys when you push to main)

---

### ✅ Monitor Your Site

**Render Dashboard:**
- Check logs regularly: https://dashboard.render.com
- Monitor resource usage
- Enable alerts (optional)

**Health Monitoring:**
- Endpoint available at: `/api/health`
- Check regularly or set up external monitoring

---

## Important Notes

### 🔐 Security
- **Never commit secrets to GitHub** - Always use Render's Environment Variables
- Rotate JWT secrets periodically
- Keep TURSO_AUTH_TOKEN private
- Change default admin password after first login

### 📦 Database
- Using **Turso** (SQLite cloud) for persistence
- Data is backed up automatically
- Free tier supports up to 1GB storage
- Contact Turso for storage limits

### 💾 File Uploads
- Render has **ephemeral filesystem** (files deleted on restart)
- Production setup should use S3 or similar
- Current setup good for testing only

### 🔄 Deployment Flow
```
git push origin main
    ↓
GitHub webhook triggers Render
    ↓
Render runs: npm install
    ↓
Render runs: npm start
    ↓
Health check: /api/health
    ↓
Service goes live
```

---

## Quick Reference: Common Tasks

### Restart Service
Dashboard → Service → **Restart Service**

### Check Logs
Dashboard → Service → **Logs** tab

### Update Environment Variables
Dashboard → Service → **Environment** tab

### View Deployment History
Dashboard → Service → **Deployments** tab

### Rollback to Previous Deployment
Dashboard → Service → **Deployments** → Click deployment → **Rollback**

---

## Contact & Support

- **Render Support:** https://support.render.com
- **Turso Support:** https://turso.tech/support
- **GitHub Issues:** Check project repository
- **Local Testing:** Run `npm start` to test before deployment

---

## Deployment Checklist (Final)

- [ ] Secrets generated and saved securely
- [ ] Turso database created and tested
- [ ] Repository pushed to GitHub
- [ ] render.yaml configured
- [ ] Service created in Render dashboard
- [ ] All environment variables set
- [ ] Build completed successfully
- [ ] Service is running and healthy
- [ ] Endpoints tested and working
- [ ] Custom domain configured (optional)
- [ ] Auto-deploy enabled
- [ ] Monitoring set up

**🎉 You're live!**
