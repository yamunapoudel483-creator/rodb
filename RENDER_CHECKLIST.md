# ✅ RENDER LAUNCH CHECKLIST - PRINT THIS!

**Start here. Complete every item before deploying.**

---

## 📋 PRE-DEPLOYMENT (Do These First)

### Setup (15 minutes)
```bash
[ ] npm install                    # Install dependencies
[ ] npm start                      # Test server locally (Ctrl+C to stop)
[ ] curl http://localhost:3000/api/health    # Verify health endpoint
```

### Security (10 minutes)
```bash
[ ] Rotate Turso token:
    turso db tokens destroy <old-token>
    turso db tokens create rodb-news
    # Copy the new token - you'll need it

[ ] Generate 4 secrets and save them:
    node -e "console.log('JWT_SECRET:', require('crypto').randomBytes(32).toString('hex'))"
    node -e "console.log('JWT_REFRESH_SECRET:', require('crypto').randomBytes(32).toString('hex'))"
    node -e "console.log('SESSION_SECRET:', require('crypto').randomBytes(32).toString('hex'))"
    node -e "console.log('ADMIN_SECRET:', require('crypto').randomBytes(16).toString('hex'))"
```

### Git (5 minutes)
```bash
[ ] git status                          # Nothing should show
[ ] git push origin main                # Push latest code
[ ] git check-ignore .env               # Should say: .env
```

### Verify (5 minutes)
```bash
[ ] bash verify-render.sh               # Run verification script
[ ] Fix any issues shown
```

---

## 🚀 DEPLOYMENT STEPS

### Step 1: Visit Render.com (2 minutes)
```bash
[ ] Go to https://render.com
[ ] Sign in / Create account
[ ] Click "New +" → "Web Service"
[ ] Click "Connect account" → "GitHub"
[ ] Authorize Render
[ ] Select repository: rodb
[ ] Click "Connect"
```

### Step 2: Configure Service (3 minutes)
```bash
[ ] Fill in form:
    - Name: rodb-news
    - Environment: Node
    - Region: Oregon
    - Branch: main
    - Build Command: npm install
    - Start Command: npm start

[ ] Click "Create Web Service"
[ ] Render starts building... (wait 2-3 mins)
```

### Step 3: Add Environment Variables (10 minutes)
```bash
[ ] In Render dashboard → Settings tab
[ ] Click "Add Environment Variable" for each:

[ ] NODE_ENV = production
[ ] PORT = 3000
[ ] LOG_LEVEL = info
[ ] TURSO_CONNECTION_URL = libsql://rodb-news-xxxxx.turso.io
[ ] TURSO_AUTH_TOKEN = (paste new token from security step)
[ ] JWT_SECRET = (paste from security step)
[ ] JWT_REFRESH_SECRET = (paste from security step)
[ ] SESSION_SECRET = (paste from security step)
[ ] ADMIN_SECRET = (paste from security step)
[ ] PASSWORD_MIN_LENGTH = 8
[ ] PASSWORD_REQUIRE_UPPERCASE = true
[ ] PASSWORD_REQUIRE_LOWERCASE = true
[ ] PASSWORD_REQUIRE_NUMBER = true
[ ] PASSWORD_REQUIRE_SPECIAL = true

[ ] Click "Deploy" or "Save"
```

### Step 4: Wait for Deployment (5 minutes)
```bash
[ ] Watch the Logs tab
[ ] Look for "Your service is live at:"
[ ] Copy that URL
```

---

## ✅ POST-DEPLOYMENT

### Test Your Site (5 minutes)
```bash
[ ] Visit your Render URL
[ ] Test health endpoint:
    curl https://your-url.onrender.com/api/health
    (Should return: {"status":"healthy",...})

[ ] Visit admin panel:
    https://your-url.onrender.com/admin
    
[ ] Login with:
    Username: admin
    Password: admin123
```

### Secure Your Site (5 minutes)
```bash
[ ] In admin panel, change admin password
[ ] Create a new admin user with your name
[ ] Delete the default admin user (or just disable it)
```

### Verify Database Persistence (5 minutes)
```bash
[ ] Create a test article in admin panel
[ ] In Render dashboard: Click "Restart Service"
[ ] Wait for restart
[ ] Check if article still exists (it should!)
```

---

## 🎯 QUICK REFERENCE: ENVIRONMENT VARIABLES

Save this for reference:

```
REQUIRED (from your setup):
- NODE_ENV=production
- TURSO_CONNECTION_URL=libsql://rodb-news-xxxxx.turso.io
- TURSO_AUTH_TOKEN=eyJhbGc...

REQUIRED (from generated secrets):
- JWT_SECRET=a1b2c3d4...
- JWT_REFRESH_SECRET=f1e2d3c4...
- SESSION_SECRET=z9y8x7w6...
- ADMIN_SECRET=9a8b7c6d...

RECOMMENDED:
- PORT=3000
- LOG_LEVEL=info
- PASSWORD_MIN_LENGTH=8
- PASSWORD_REQUIRE_UPPERCASE=true
- PASSWORD_REQUIRE_LOWERCASE=true
- PASSWORD_REQUIRE_NUMBER=true
- PASSWORD_REQUIRE_SPECIAL=true
```

---

## ❌ COMMON MISTAKES TO AVOID

```
✗ DON'T: Forget to rotate Turso token
✓ DO:    Delete old token, create new one

✗ DON'T: Hardcode secrets in environment variables
✓ DO:    Use generated random strings

✗ DON'T: Use NODE version higher than 18.x
✓ DO:    Stick with 18.x (compatible with Render free)

✗ DON'T: Upload files and expect them to persist
✓ DO:    Use S3 or similar for file storage

✗ DON'T: Leave default admin password unchanged
✓ DO:    Change it immediately after deployment

✗ DON'T: Ignore error logs
✓ DO:    Check Render logs if anything goes wrong

✗ DON'T: Assume free tier will be fast
✓ DO:    Expect 15-min sleep, first request might be slow
```

---

## 📞 TROUBLESHOOTING

### 🔴 Deployment Failed
```bash
[ ] Check Render Logs tab
[ ] Look for ERROR messages
[ ] Run local test: npm start
[ ] Verify package.json is correct
```

### 🔴 Can't Connect to Database
```bash
[ ] Verify TURSO_CONNECTION_URL is correct format
[ ] Verify TURSO_AUTH_TOKEN is the NEW one
[ ] Test: turso db shell rodb-news
[ ] Check Render logs for connection errors
```

### 🔴 Can't Login to Admin
```bash
[ ] Verify default creds: admin / admin123
[ ] Check database initialized (see logs)
[ ] Try creating new admin user locally first
[ ] Check Render logs for auth errors
```

### 🔴 Website is Slow or Won't Respond
```bash
[ ] Free tier may be sleeping (normal after 15 mins)
[ ] Check Render dashboard for restart status
[ ] Look at Logs tab for crashes
[ ] Try health endpoint: curl https://your-url/api/health
```

---

## 📚 HELPFUL DOCUMENTATION

If you need more details:

1. **[RENDER_ACTION_ITEMS.md](RENDER_ACTION_ITEMS.md)** - Detailed action steps
2. **[RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md)** - Complete deployment guide
3. **[RENDER_GOTCHAS.md](RENDER_GOTCHAS.md)** - Common issues & solutions
4. **[RENDER_QUICK_START.md](RENDER_QUICK_START.md)** - Quick reference

---

## 🎉 SUCCESS CRITERIA

Your deployment is successful when:

✅ Render shows "Your service is live at: https://..."  
✅ Health endpoint returns {"status":"healthy"}  
✅ Admin panel loads at /admin  
✅ You can login with admin/admin123  
✅ You can create an article  
✅ Articles persist after service restart  
✅ Your website is publicly accessible  

---

## ✨ YOU'RE READY!

Follow this checklist step by step, and your website will be live on Render!

**Current Time:** $(date)  
**Status:** Ready to Deploy ✅  
**Platform:** Render  
**Database:** Turso (cloud SQLite)  

**Let's go! 🚀**

---

**For support:**
- Check RENDER_GOTCHAS.md for common issues
- Check Render logs (https://dashboard.render.com)
- Visit https://support.render.com for Render help
- Visit https://turso.tech for database help
