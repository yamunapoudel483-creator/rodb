# Vercel Deployment Guide - Routine of Dhulikhel News

## ✅ Pre-Deployment Checklist

Your application is now configured for Vercel deployment. Follow these steps:

### 1. **Database Setup (Turso)**
The application uses **Turso** (libsql) which is serverless-compatible and perfect for Vercel.

**Steps:**
- Go to [turso.tech](https://turso.tech)
- Create a free account
- Create a new database
- Get your connection URL and auth token
- Save these values - you'll need them in Vercel

### 2. **Environment Variables for Vercel**

In your Vercel dashboard, add these environment variables:

```
TURSO_CONNECTION_URL=libsql://your-db-name-xxx.turso.io
TURSO_AUTH_TOKEN=your-auth-token-from-turso
NODE_ENV=production
JWT_SECRET=generate-a-random-32-char-string-here
JWT_REFRESH_SECRET=generate-another-random-32-char-string-here
```

**Generate secure secrets:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. **Deploy to Vercel**

**Option A: Using Vercel CLI**
```bash
npm install -g vercel
vercel deploy --prod
```

**Option B: Using GitHub (Recommended)**
- Push code to GitHub
- Go to [vercel.com](https://vercel.com)
- Click "New Project"
- Select your GitHub repository
- Vercel will auto-detect settings from `vercel.json`
- Add environment variables in "Environment Variables" section
- Click "Deploy"

### 4. **Database Migration**

After first deployment, initialize the database:

```bash
# Via Vercel CLI
vercel env pull  # Pulls your environment variables
npm run init-db  # Initializes database schema
```

## 🔧 Technical Details

### File Structure for Vercel
```
server/
├── server.js          (Entry point)
├── app.js             (Express app)
├── config/            (Configuration)
├── routes/            (API routes)
├── controllers/       (Business logic)
├── public/            (Static files - CSS, JS, images)
├── uploads/           (User uploads - stored here)
└── data/              (Local DB - development only)
```

### Build Configuration
- **buildCommand**: `npm run build`
- **outputDirectory**: dist (if needed in future)
- **maxLambdaSize**: 50MB
- **Timeout**: 60 seconds per request
- **Memory**: 1024MB per function

### Static Files
- CSS, JS, images: `/server/public/*`
- Automatically cached (3600s = 1 hour)
- Served from Vercel Edge Network

## ⚠️ Important Notes

### File Uploads
- Uploads are stored in `/server/uploads/`
- **WARNING**: Vercel's filesystem is ephemeral (temporary)
- For persistent storage, consider:
  - **AWS S3** (recommended)
  - **Cloudinary** (easier for images)
  - **Vercel Blob Storage** (beta)

**To enable cloud storage:**
Update `server/routes/media.js` and `server/routes/ads.js` to use S3/Cloudinary

### Logs
- Logs are stored in `/server/logs/`
- Logs are ephemeral in Vercel
- Use **Vercel Monitoring** or **LogRocket** for persistent logs

### Database
- ✅ Turso (libsql) - Ready for production
- ✅ Serverless compatible
- ✅ Auto-scaling
- ✅ No configuration needed on deployment

## 🚀 Deployment Steps Summary

1. **Create Turso database** → Get connection URL & token
2. **Set environment variables** in Vercel dashboard
3. **Connect GitHub repo** to Vercel
4. **Deploy** - Vercel automatically builds and deploys
5. **Initialize database** - Run `npm run init-db` if needed
6. **Test** - Visit your Vercel domain

## ✅ Testing Checklist

After deployment:
- [ ] Homepage loads correctly
- [ ] Articles display properly
- [ ] Search functionality works
- [ ] Admin login works
- [ ] Image uploads work
- [ ] Category pages display
- [ ] Mobile layout responsive
- [ ] Dark/Light theme toggle works
- [ ] Ticker animation runs smoothly
- [ ] Social sharing buttons functional

## 🆘 Troubleshooting

### "Database connection failed"
- Check TURSO_CONNECTION_URL format
- Verify TURSO_AUTH_TOKEN is correct
- Ensure database exists in Turso dashboard

### "Timeout errors"
- Vercel has 60-second timeout limit
- Check for long-running queries
- Consider adding pagination/limits

### "File upload fails"
- Use cloud storage (S3, Cloudinary) instead of filesystem
- Vercel ephemeral filesystem doesn't persist uploads

### "Images not loading"
- Check `/public/` path in requests
- Verify images exist in `server/public/`
- Check browser dev tools (Network tab)

## 📊 Monitoring

**Recommended Monitoring Tools:**
- Vercel Analytics (built-in, free)
- Sentry.io (error tracking)
- LogRocket (session replay)
- New Relic (performance monitoring)

## 🔐 Security Best Practices

✅ Already configured:
- CORS enabled with whitelist
- Rate limiting on API routes
- Helmet.js for security headers
- JWT authentication
- Password hashing with bcrypt
- SQL injection prevention

⚠️ Still needed:
- [ ] Set strong JWT_SECRET (done via env vars)
- [ ] Enable HTTPS (automatic with Vercel)
- [ ] Regular security audits
- [ ] Monitor for suspicious activity

## 📈 Performance Optimization

Current setup:
- ✅ Static files cached (1 hour)
- ✅ Optimized API response sizes
- ✅ Database indexing in Turso
- ✅ Lazy loading on frontend
- ✅ Image optimization

Further improvements:
- Add CDN for images (Cloudinary)
- Enable compression (gzip already enabled)
- Use Redis for session caching (Upstash.com)

## 🎯 Next Steps

1. Deploy to Vercel following steps above
2. Configure cloud storage for uploads
3. Set up monitoring and error tracking
4. Regular backups of Turso database
5. Monitor performance metrics

---

**Questions?** Check Vercel docs: https://vercel.com/docs
