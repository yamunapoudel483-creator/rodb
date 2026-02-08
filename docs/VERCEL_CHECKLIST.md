# Vercel Deployment Checklist

## Pre-Deployment

- [ ] All code committed to GitHub
- [ ] `.env.example` updated with all required variables
- [ ] `.gitignore` configured (no .env in git)
- [ ] `vercel.json` configured
- [ ] `package.json` has build script

## Database Setup

- [ ] Created Turso account at turso.tech
- [ ] Created database in Turso
- [ ] Got TURSO_CONNECTION_URL
- [ ] Got TURSO_AUTH_TOKEN
- [ ] Tested connection locally (optional)

## Vercel Configuration

- [ ] Vercel account created
- [ ] GitHub connected to Vercel
- [ ] Environment variables added:
  - [ ] TURSO_CONNECTION_URL
  - [ ] TURSO_AUTH_TOKEN
  - [ ] JWT_SECRET (use generated random string)
  - [ ] JWT_REFRESH_SECRET (use generated random string)
  - [ ] NODE_ENV=production

## Deployment

- [ ] Pushed code to GitHub (if using GitHub integration)
- [ ] Vercel auto-deployed or ran `vercel deploy --prod`
- [ ] Deployment successful (check Vercel dashboard)
- [ ] No error messages in logs

## Post-Deployment Testing

### Basic Functionality
- [ ] Homepage loads
- [ ] CSS/JS/Images load correctly
- [ ] No console errors in browser dev tools
- [ ] No 404 errors in Network tab

### Content
- [ ] Articles display
- [ ] Images show
- [ ] Categories work
- [ ] Search functionality works
- [ ] News ticker animates

### Admin Panel
- [ ] Admin login page loads
- [ ] Can login with credentials
- [ ] Dashboard displays
- [ ] Can create new article
- [ ] Can upload images

### Mobile
- [ ] Mobile layout responsive
- [ ] Touch interactions work
- [ ] Images display correctly
- [ ] Menu opens/closes
- [ ] Search responsive

### Features
- [ ] Dark/Light theme toggle works
- [ ] Language switching works (if implemented)
- [ ] Social sharing buttons work
- [ ] Comments section works (if enabled)

## Performance

- [ ] Page load time < 3 seconds
- [ ] No 503/504 errors
- [ ] Static files cached properly
- [ ] API responses fast (< 500ms)

## Security

- [ ] No API keys in code
- [ ] All environment variables set
- [ ] HTTPS enabled (automatic)
- [ ] CORS working properly
- [ ] Authentication tokens valid

## Monitoring

- [ ] Vercel Analytics enabled
- [ ] Error tracking setup (Sentry/etc)
- [ ] Logs accessible
- [ ] Monitoring dashboard configured

## Backups & Recovery

- [ ] Database backup strategy decided
- [ ] Backup frequency set
- [ ] Recovery procedure documented
- [ ] Contact info for Turso support saved

## Post-Deploy Actions

- [ ] Domain configured (if custom domain)
- [ ] SSL certificate verified
- [ ] Email notifications configured
- [ ] Team members notified
- [ ] Documentation updated
- [ ] User manual created

---

**Deployment Status**: Ready for Vercel ✅

**Contact**: For support, check:
- Vercel Docs: https://vercel.com/docs
- Turso Docs: https://docs.turso.tech
