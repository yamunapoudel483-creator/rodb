# 🚀 RENDER LAUNCH - QUICK REFERENCE CARD

**Print this or keep it handy!**

---

## ⚡ 5-MINUTE DEPLOYMENT CHECKLIST

- [ ] `git push origin main` ✓ Code committed
- [ ] Turso database created ✓ Connection URL saved
- [ ] Secrets generated ✓ Saved securely (not in code)
- [ ] Render account ready ✓ GitHub connected
- [ ] `npm start` works locally ✓ No errors

---

## 🔐 SECRETS TO GENERATE

Run these commands, **save the output**:

```bash
node -e "console.log('JWT_SECRET:', require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log('JWT_REFRESH_SECRET:', require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log('SESSION_SECRET:', require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log('ADMIN_SECRET:', require('crypto').randomBytes(16).toString('hex'))"
```

---

## 🗄️ TURSO DATABASE

```bash
turso auth login
turso db create rodb-news
turso db show rodb-news  # Get connection URL
turso db tokens create rodb-news  # Get auth token
```

**You need:**
- `TURSO_CONNECTION_URL=libsql://rodb-news-xxx.turso.io`
- `TURSO_AUTH_TOKEN=eyJhbGciOi...` (the long token)

---

## 📋 ENVIRONMENT VARIABLES FOR RENDER

| Variable | Value | Example |
|----------|-------|---------|
| NODE_ENV | production | `production` |
| PORT | 3000 | `3000` |
| LOG_LEVEL | info | `info` |
| TURSO_CONNECTION_URL | Your DB URL | `libsql://rodb-news-xyz.turso.io` |
| TURSO_AUTH_TOKEN | Your token | `eyJhbGciOi...` |
| JWT_SECRET | Generated | (from command above) |
| JWT_REFRESH_SECRET | Generated | (from command above) |
| SESSION_SECRET | Generated | (from command above) |
| ADMIN_SECRET | Generated | (from command above) |

---

## 🎯 RENDER DEPLOYMENT STEPS

1. Go to **render.com**
2. Click **New +** → **Web Service**
3. Select your GitHub repo: `rodb`
4. Fill in:
   - Name: `rodb-news`
   - Environment: `Node`
   - Build: `npm install`
   - Start: `npm start`
5. Click **Create Web Service**
6. While building, go to **Settings** → **Environment Variables**
7. Add all variables from the table above
8. Done! Wait for deployment to finish.

---

## ✅ AFTER DEPLOYMENT

```bash
# Test your live site
curl https://your-service.onrender.com/api/health

# Should return:
# {"status":"healthy",...}
```

**Admin access:**
- URL: `https://your-service.onrender.com/admin`
- Username: `admin`
- Password: `admin123`

⚠️ **CHANGE PASSWORD IMMEDIATELY!**

---

## 🚨 IF SOMETHING FAILS

1. Check Render logs (Logs tab in dashboard)
2. Look for ERROR messages
3. Common issues:
   - Missing environment variable
   - Invalid Turso token
   - Node version mismatch

---

## 📚 FULL GUIDES

- **Complete guide:** See `RENDER_DEPLOYMENT.md`
- **Gotchas & fixes:** See `RENDER_GOTCHAS.md`
- **Questions?** Check docs/ folder

---

## 🎉 YOU'RE LIVE!

Website URL: `https://rodb-news.onrender.com` (or whatever you named it)

Next: Set up custom domain, change admin password, monitor your site!
