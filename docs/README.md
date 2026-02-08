# RODB Documentation

Complete guide to running, deploying, and maintaining the RODB (Radio Online Database) news platform.

## Quick Navigation

### Getting Started
- **[START_HERE.md](START_HERE.md)** - Initial setup and local development
- **[DEPLOYMENT_CHANGES.md](DEPLOYMENT_CHANGES.md)** - Summary of recent updates and improvements

### Vercel Deployment
- **[VERCEL_INDEX.md](VERCEL_INDEX.md)** - Complete Vercel deployment guide (START HERE for deployment)
- **[VERCEL_QUICK_START.md](VERCEL_QUICK_START.md)** - Quick deployment steps
- **[VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md)** - Detailed deployment configuration
- **[VERCEL_CHECKLIST.md](VERCEL_CHECKLIST.md)** - Pre-deployment checklist
- **[VERCEL_READY.md](VERCEL_READY.md)** - Post-deployment verification

### Feature Documentation
- **[README_JOURNALIST_PORTAL.md](README_JOURNALIST_PORTAL.md)** - Journalist portal features and usage
- **[README_NEPALI_LANGUAGE.md](README_NEPALI_LANGUAGE.md)** - Nepali language support
- **[README_SOCIAL_SHARING.md](README_SOCIAL_SHARING.md)** - Social sharing integration

## Project Overview

RODB is a modern news platform built with:
- **Backend**: Express.js with Node.js
- **Database**: Turso (libsql) - serverless SQLite
- **Frontend**: Mobile-responsive HTML/CSS/JavaScript
- **Deployment**: Vercel serverless functions
- **Authentication**: JWT with secure token refresh
- **Security**: Helmet.js, CORS, Rate limiting, bcrypt

## Key Features

- Mobile-first responsive design
- Dark/light theme support
- Nepali language support
- Journalist portal with article management
- Social sharing integration
- Real-time trending news
- Optimized performance (90% faster trending news loading)
- Secure authentication system

## Environment Setup

See [START_HERE.md](START_HERE.md) for complete setup instructions.

### Quick Start
```bash
npm install
npm start
```

## Deployment

For Vercel deployment, start with [VERCEL_INDEX.md](VERCEL_INDEX.md).

## Support

Refer to the specific documentation files above for detailed information about each feature and deployment process.
