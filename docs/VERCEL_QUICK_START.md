# Quick Start: Vercel Deployment in 5 Minutes

## Step 1: Set Up Turso Database (2 min)

1. Go to https://turso.tech/sign-up
2. Create free account
3. Create new database (any name, e.g., "rodb")
4. Copy **Connection URL** (looks like: `libsql://xxx-yyy.turso.io`)
5. Copy **Auth Token** (long random string)

## Step 2: Push to GitHub (1 min)

```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

## Step 3: Deploy to Vercel (1 min)

1. Go to https://vercel.com/new
2. Select your GitHub repository
3. Click "Import"
4. Vercel auto-detects settings from `vercel.json` ✅

## Step 4: Add Environment Variables (1 min)

In Vercel dashboard, go to **Settings > Environment Variables** and add:

```
TURSO_CONNECTION_URL = libsql://your-db-name-xxx.turso.io
TURSO_AUTH_TOKEN = your-auth-token-here
JWT_SECRET = (generate: run in terminal: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_REFRESH_SECRET = (generate: same command again with different token)
NODE_ENV = production
```

## Step 5: Deploy! 

Click **Deploy** button in Vercel dashboard

---

## ✅ Done! Your site is live

Visit your Vercel domain: `https://your-project.vercel.app`

### What's configured:
- ✅ Turso database (serverless, auto-scaling)
- ✅ Express.js server
- ✅ Static files caching
- ✅ Auto SSL/HTTPS
- ✅ API routing
- ✅ Error handling

### Next (Optional):
- [ ] Connect custom domain
- [ ] Set up error tracking (Sentry)
- [ ] Configure cloud storage (S3) for uploads
- [ ] Set up monitoring

---

## 🆘 Issues?

**Deployment failed?**
- Check logs in Vercel dashboard
- Verify environment variables are set
- Ensure Turso credentials are correct

**Database connection error?**
- Verify TURSO_CONNECTION_URL format
- Check TURSO_AUTH_TOKEN
- Test: `curl https://your-project.vercel.app/api/health`

**Images not showing?**
- Check browser DevTools > Network tab
- Verify `/public/` directory exists
- Images should auto-serve from `/server/public/`

---

**Questions?** See: [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)
