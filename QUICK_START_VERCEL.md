# 🚀 QUICK START: Deploy to Vercel

## 5-Minute Deployment Guide

### What's Ready ✅
- Application code optimized for Vercel
- Serverless function properly configured
- Database initialization handled
- Static file routing set up
- All documentation complete

### What You Need to Do

#### 1️⃣ Generate Secret Keys (1 min)
```bash
node -e "console.log('JWT_SECRET:', require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log('JWT_REFRESH_SECRET:', require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log('SESSION_SECRET:', require('crypto').randomBytes(32).toString('hex'))"
```
**Save all three outputs!**

#### 2️⃣ Create Turso Database (2 min)
```bash
turso auth login
turso db create rodb-news
turso db show rodb-news          # Copy this URL
turso db tokens create rodb-news  # Copy this token
```

#### 3️⃣ Deploy to Vercel (1 min)
1. Go to https://vercel.com/new
2. Import your GitHub repo
3. Click Deploy

#### 4️⃣ Add Environment Variables (1 min)
In Vercel Settings > Environment Variables, paste:
```
NODE_ENV=production
TURSO_CONNECTION_URL=libsql://rodb-news-xxxxx.turso.io
TURSO_AUTH_TOKEN=your-token-from-step-2
JWT_SECRET=your-key-from-step-1
JWT_REFRESH_SECRET=your-key-from-step-1
SESSION_SECRET=your-key-from-step-1
ADMIN_SECRET=secure-admin-secret
LOG_LEVEL=info
```

#### 5️⃣ Redeploy
Go to Deployments → Click Redeploy → Use existing vars → Done!

### Test Deployment
```
✅ https://your-app.vercel.app/api/health
✅ https://your-app.vercel.app/admin
✅ https://your-app.vercel.app
```

### Done! 🎉
Your app is live!

---

## Common Issues

| Issue | Fix |
|-------|-----|
| Build failed | Check Vercel logs for missing env vars |
| Database error | Verify TURSO_CONNECTION_URL is correct |
| Admin won't load | Check that routes are configured |
| Static files missing | Verify /public directory exists |

### Need Help?
- Read: DEPLOYMENT_SUMMARY.md (full details)
- Check: VERCEL_DEPLOYMENT_CHECKLIST.md (complete steps)
- Docs: docs/VERCEL_DEPLOYMENT_SETUP.md (troubleshooting)

**All documentation has been committed to GitHub ✅**
