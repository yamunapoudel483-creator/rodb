# ⚠️ RENDER DEPLOYMENT - CRITICAL GOTCHAS & SOLUTIONS

**MUST READ BEFORE DEPLOYING TO RENDER**

---

## 🔴 CRITICAL ISSUES TO AVOID

### 1. **Secrets in .env File**

❌ **PROBLEM:** `.env` file is `.gitignored` (good!) but you might accidentally commit it  
✅ **SOLUTION:**
- **NEVER** put secrets in `.env` unless it's for local development only
- **ALWAYS** use Render's Environment Variables dashboard
- Double-check: `git status` should NOT show `.env` file

```bash
# Verify .env is ignored
git check-ignore .env
# Should output: .env (if it's ignored)
```

---

### 2. **Unsecured Secrets Already Exposed**

⚠️ **ALERT:** Your `.env` file currently contains:
- `TURSO_AUTH_TOKEN=eyJhbGciOiJFZERTQSI...` (exposed token!)
- `JWT_SECRET=your-super-secret...` (placeholder)

❌ **WHAT YOU MUST DO IMMEDIATELY:**
1. **Rotate your Turso token:**
   ```bash
   turso db tokens destroy <old-token>
   turso db tokens create rodb-news
   ```
2. **Never commit `.env` to GitHub**
3. **Use new secrets in Render dashboard only**

---

### 3. **Node.js Version Mismatch**

❌ **PROBLEM:** Was set to Node 24.x (too new, causes build issues)  
✅ **SOLUTION:** Now set to 18.x (stable, compatible with Render free tier)  
✓ **Status:** FIXED in package.json

---

### 4. **Database Connection Failures**

❌ **PROBLEM:** Render runs your app, but database is in the cloud (Turso)  
**Common errors:**
- `ECONNREFUSED` - App can't reach database
- `401 Unauthorized` - Invalid auth token
- `ENOTFOUND` - Database URL is wrong

✅ **SOLUTION:**
- Verify Turso URL format: `libsql://rodb-news-xxx.turso.io`
- Verify auth token is valid (rotate if needed)
- Test locally FIRST: `npm start` should initialize DB
- Check Render logs for specific error

---

### 5. **Ephemeral Filesystem (Files Disappear)**

❌ **PROBLEM:** Render restarts your app periodically - all uploaded files will be deleted!

**Files that WILL be lost:**
- `/server/uploads/*` - Any uploaded images/videos
- `/server/logs/*` - Log files
- `/server/data/*` - SQLite database (if using local DB)

✅ **SOLUTIONS:**
- **Database:** Using Turso (cloud) ✓ SAFE
- **Uploaded files:** Need cloud storage
  - Short-term: Accept files are lost on restart
  - Long-term: Integrate AWS S3 or Cloudinary
- **Logs:** Stream to service like Loggly or Papertrail

---

### 6. **Free Tier Sleep Mode**

❌ **PROBLEM:** Render free tier puts services to sleep after 15 mins of inactivity
- First request after sleep will be slow (30 seconds)
- Subsequent requests are normal

✅ **SOLUTIONS:**
- Upgrade to paid plan ($7+/month) for always-on
- Use uptime monitoring service (UptimeRobot) to keep it warm
- Accept occasional 30-second delays on first request

---

## 🟡 IMPORTANT REQUIREMENTS

### Port Configuration
```javascript
// ✓ CORRECT (Render assigns PORT via env var)
const PORT = process.env.PORT || 3000;

// ✗ WRONG (Hardcoded port doesn't work)
const PORT = 3000;
```

**Status:** ✓ VERIFIED - Your app uses `process.env.PORT`

---

### Health Check Endpoint
```bash
# Your app must respond to this
GET /api/health
```

**Response should be:**
```json
{
  "status": "healthy",
  "timestamp": "2026-02-11T...",
  "uptime": 123.456,
  "environment": "production"
}
```

**Status:** ✓ VERIFIED - Endpoint exists and works

---

### Environment Variables Must Be Set in Render

**NEVER put these in code:**
```javascript
// ✗ WRONG
const secret = "my-super-secret-key";

// ✓ CORRECT
const secret = process.env.JWT_SECRET;
if (!secret) throw new Error("JWT_SECRET not set");
```

**Status:** ✓ VERIFIED - Your app uses environment variables

---

## 🟢 PRE-DEPLOYMENT CHECKLIST

Before hitting "Deploy" in Render, check ALL of these:

### Git & GitHub
- [ ] `git status` shows nothing uncommitted
- [ ] `git log` shows your recent commits
- [ ] Repository is public OR Render has GitHub access
- [ ] No `.env` file shows in `git status`

```bash
# Verify
git status
git check-ignore .env .env.local .env.production
```

### Local Testing
- [ ] `npm install` runs without errors
- [ ] `npm start` starts server successfully
- [ ] `curl http://localhost:3000/api/health` returns healthy status
- [ ] Can access admin at `http://localhost:3000/admin`

```bash
# Test locally
npm install
npm start
# In another terminal:
curl http://localhost:3000/api/health
```

### Turso Database Setup
- [ ] Database created: `turso db create rodb-news`
- [ ] Connection URL saved: `libsql://rodb-news-xxx.turso.io`
- [ ] Auth token created: `turso db tokens create rodb-news`
- [ ] Token saved securely (never in code or GitHub)
- [ ] Can connect: `turso db shell rodb-news` (shows SQLite prompt)

```bash
# Verify
turso db show rodb-news
turso db shell rodb-news
# Should open SQLite console
```

### Secrets Generated
- [ ] JWT_SECRET (32+ chars): `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- [ ] JWT_REFRESH_SECRET (32+ chars)
- [ ] SESSION_SECRET (32+ chars)
- [ ] ADMIN_SECRET (16+ chars)
- [ ] All 4 secrets saved in secure location (password manager)

```bash
# Generate new ones
node -e "console.log('JWT_SECRET:', require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log('JWT_REFRESH_SECRET:', require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log('SESSION_SECRET:', require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log('ADMIN_SECRET:', require('crypto').randomBytes(16).toString('hex'))"
```

### Render Preparation
- [ ] Render account created and verified
- [ ] GitHub connected to Render (authorized)
- [ ] Repository visible in Render's GitHub integration

---

## 🚀 ACTUAL DEPLOYMENT STEPS

### Step 1: Commit Your Code

```bash
cd /home/arcgg/rodb
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### Step 2: Go to render.com

1. Sign in or create account
2. Click **New +** → **Web Service**
3. Click **Connect account** → **GitHub**
4. Select repository: `rodb`
5. Click **Connect**

### Step 3: Configure Service

| Setting | Value |
|---------|-------|
| Name | `rodb-news` |
| Environment | `Node` |
| Build Command | `npm install` |
| Start Command | `npm start` |
| Region | `Oregon` (free tier only) |
| Branch | `main` |

### Step 4: Add Environment Variables

Click **Add Environment Variable** for each:

```
NODE_ENV=production
PORT=3000
LOG_LEVEL=info

TURSO_CONNECTION_URL=libsql://rodb-news-xxxxx.turso.io
TURSO_AUTH_TOKEN=your-turso-token-here

JWT_SECRET=your-jwt-secret-here
JWT_REFRESH_SECRET=your-jwt-refresh-secret-here
SESSION_SECRET=your-session-secret-here
ADMIN_SECRET=your-admin-secret-here

PASSWORD_MIN_LENGTH=8
PASSWORD_REQUIRE_UPPERCASE=true
PASSWORD_REQUIRE_LOWERCASE=true
PASSWORD_REQUIRE_NUMBER=true
PASSWORD_REQUIRE_SPECIAL=true
```

### Step 5: Deploy!

Click **Create Web Service** and wait for it to build and deploy.

---

## 📊 EXPECTED DEPLOYMENT OUTPUT

Your logs should show something like:

```
Starting build process...
npm install
npm start

✓ Database initialized successfully
✓ Database schema ready
✓ Default roles created
✓ Default permissions created
✓ Default admin user created
✓ Default categories created
✓ Express app loaded
✓ Server listening on 0.0.0.0:3000
```

If you see any ERROR lines, check the troubleshooting section.

---

## 🔧 TROUBLESHOOTING QUICK FIXES

### "npm ERR! code E404"
- Check node version: should be 18.x
- Delete `package-lock.json` locally, re-run `npm install`

### "TURSO_AUTH_TOKEN not found"
- Environment variable not set in Render dashboard
- Add it to Settings → Environment Variables

### "Cannot connect to database"
- Wrong TURSO_CONNECTION_URL format
- Invalid TURSO_AUTH_TOKEN
- Test locally: `turso db shell rodb-news`

### "Port is already in use"
- Don't specify port in code (use process.env.PORT)
- Let Render assign the port
- Status: ✓ VERIFIED in your code

### "502 Bad Gateway"
- App crashed or won't start
- Check Logs for errors
- Likely: Missing environment variable

---

## 📋 AFTER DEPLOYMENT

### ✅ Test Your Live Site

```bash
# Get your service URL from Render dashboard, then:
curl https://your-service.onrender.com/api/health

# Should return:
# {"status":"healthy",...}
```

### ✅ Create a New Super Admin

Default admin user:
- Username: `admin`
- Password: `admin123`

⚠️ **CHANGE THIS IMMEDIATELY:**
1. Log in to admin panel
2. Go to Users/Settings
3. Change admin password
4. Create your own admin account
5. Delete the default admin user

### ✅ Verify Database is Persistent

1. Create an article in admin panel
2. Wait 2 minutes
3. In Render dashboard: **Restart Service**
4. Check if article still exists (it should!)

If articles disappeared → database not persisting (check Turso connection)

---

## 🆘 IF DEPLOYMENT FAILS

1. **Check Render logs:**
   - Go to your service
   - Click **Logs** tab
   - Look for red ERROR lines

2. **Common fixes:**
   - Missing environment variable
   - Invalid Turso token
   - Node version incompatibility
   - Syntax error in code

3. **Get help:**
   - Render support: https://support.render.com
   - Check logs first!
   - Provide error output when asking for help

---

## ✨ DEPLOYMENT SUMMARY

**Your application is configured for:**
- ✓ Turso database (cloud, persistent)
- ✓ Environment-based configuration
- ✓ Health check endpoint
- ✓ Graceful error handling
- ✓ Security middleware (helmet, CORS)
- ✓ JWT authentication
- ✓ Admin panel

**Known limitations (free tier):**
- ⏸️ Service sleeps after 15 mins inactivity
- 📁 Uploaded files lost on restart (use S3 later)
- 🔒 Free tier for development/testing

**Next steps:**
1. Generate secrets (don't share!)
2. Create Turso database
3. Deploy to Render
4. Test your live site
5. Change default admin password
6. Set up custom domain (optional)

---

## 📞 SUPPORT

**Something not working?**

1. Check Render logs first
2. Verify all environment variables are set
3. Try local test: `npm start`
4. Search error message online
5. Contact Render support if needed

**Good luck! 🚀**
