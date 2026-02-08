#!/bin/bash

# Vercel Deployment Verification Script
# This script checks if your project is ready for Vercel deployment

echo "🔍 Vercel Deployment Readiness Check"
echo "===================================="
echo ""

ERRORS=0
WARNINGS=0
CHECKS_PASSED=0

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} File exists: $1"
        ((CHECKS_PASSED++))
    else
        echo -e "${RED}✗${NC} File missing: $1"
        ((ERRORS++))
    fi
}

check_content() {
    if grep -q "$2" "$1" 2>/dev/null; then
        echo -e "${GREEN}✓${NC} Found in $1: $2"
        ((CHECKS_PASSED++))
    else
        echo -e "${RED}✗${NC} Missing in $1: $2"
        ((ERRORS++))
    fi
}

warn() {
    echo -e "${YELLOW}⚠${NC} Warning: $1"
    ((WARNINGS++))
}

# Check required files
echo "📋 Checking required configuration files..."
check_file "vercel.json"
check_file ".env.example"
check_file ".gitignore"
check_file "package.json"
check_file "api/index.js"
echo ""

# Check package.json
echo "📦 Checking package.json..."
check_content "package.json" '"build"'
check_content "package.json" '"start"'
check_content "package.json" '@libsql/client'
check_content "package.json" 'express'
echo ""

# Check environment setup
echo "🔐 Checking environment configuration..."
check_content ".env.example" 'TURSO_CONNECTION_URL'
check_content ".env.example" 'TURSO_AUTH_TOKEN'
check_content ".env.example" 'JWT_SECRET'
check_content ".env.example" 'JWT_REFRESH_SECRET'
check_content ".env.example" 'NODE_ENV'
echo ""

# Check gitignore
echo "🚫 Checking .gitignore..."
check_content ".gitignore" '.env'
check_content ".gitignore" 'node_modules'
check_content ".gitignore" '*.db'
check_content ".gitignore" 'uploads/'
echo ""

# Check app structure
echo "📁 Checking project structure..."
check_file "server/app.js"
check_file "server/server.js"
check_file "server/public"
check_file "server/routes"
check_file "server/config/database.js"
echo ""

# Check for problematic code patterns
echo "🔎 Checking for Vercel incompatibilities..."

# Check for local file writes
if grep -r "fs.writeFileSync\|fs.mkdir" server --include="*.js" 2>/dev/null | grep -v node_modules > /dev/null; then
    warn "File write operations detected - uploads will not persist on Vercel (use S3/Cloudinary)"
fi

# Check for hardcoded paths
if grep -r "\/home\|\/var\/www\|C:\\\\" server --include="*.js" 2>/dev/null | grep -v node_modules > /dev/null; then
    warn "Absolute file paths detected - may cause issues on Vercel"
fi

# Check for local database
if grep -r "sqlite" server --include="*.js" 2>/dev/null | grep -v node_modules | grep -v "@libsql" > /dev/null; then
    warn "SQLite operations detected - should use Turso for production"
fi

echo ""

# Summary
echo "📊 Summary"
echo "=========="
echo -e "${GREEN}Passed:${NC} $CHECKS_PASSED"
echo -e "${YELLOW}Warnings:${NC} $WARNINGS"
echo -e "${RED}Errors:${NC} $ERRORS"
echo ""

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✓ Project is ready for Vercel deployment!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Create Turso database at https://turso.tech"
    echo "2. Push code to GitHub"
    echo "3. Connect GitHub to Vercel at https://vercel.com"
    echo "4. Add environment variables in Vercel dashboard"
    echo "5. Click Deploy!"
    echo ""
    exit 0
else
    echo -e "${RED}✗ Please fix the errors above before deploying${NC}"
    echo ""
    if [ $WARNINGS -gt 0 ]; then
        echo -e "${YELLOW}Note: $WARNINGS warnings should be reviewed${NC}"
    fi
    exit 1
fi
