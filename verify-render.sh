#!/bin/bash

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🔍 RoDB Pre-Deployment Verification Script"
echo "=========================================="
echo ""

# Counter for checks
passed=0
failed=0
warnings=0

# Helper functions
pass() {
    echo -e "${GREEN}✓${NC} $1"
    ((passed++))
}

fail() {
    echo -e "${RED}✗${NC} $1"
    ((failed++))
}

warn() {
    echo -e "${YELLOW}⚠${NC} $1"
    ((warnings++))
}

info() {
    echo -e "${YELLOW}ℹ${NC} $1"
}

# 1. Check Git status
echo "📦 GIT CHECKS"
echo "-------------"

if git rev-parse --git-dir > /dev/null 2>&1; then
    pass "Git repository found"
    
    # Check if .env is ignored
    if git check-ignore .env > /dev/null 2>&1; then
        pass ".env file is .gitignored (not in repo)"
    else
        fail ".env file is NOT .gitignored - SECURITY RISK!"
    fi
    
    # Check uncommitted changes
    if [ -z "$(git status --porcelain)" ]; then
        pass "All changes committed"
    else
        warn "Uncommitted changes exist:"
        git status --short | sed 's/^/  /'
    fi
    
    # Check if on main branch
    current_branch=$(git rev-parse --abbrev-ref HEAD)
    if [ "$current_branch" == "main" ]; then
        pass "On main branch"
    else
        warn "On branch '$current_branch' (should be main for Render)"
    fi
else
    fail "Not a git repository"
fi

echo ""
echo "📁 PROJECT STRUCTURE"
echo "--------------------"

# Check important directories
for dir in server/data server/uploads server/logs server/backups; do
    if [ -d "$dir" ]; then
        pass "Directory exists: $dir"
    else
        fail "Missing directory: $dir"
    fi
done

echo ""
echo "📋 CONFIGURATION FILES"
echo "---------------------"

# Check package.json
if [ -f "package.json" ]; then
    pass "package.json exists"
    
    # Check node version in engines
    if grep -q '"node": "18.x"' package.json; then
        pass "Node.js version set to 18.x (Render compatible)"
    elif grep -q '"node": "24.x"' package.json; then
        warn "Node.js version set to 24.x (may have issues on Render)"
    else
        warn "Node.js version not specified or unusual"
    fi
    
    # Check start script
    if grep -q '"start": "node server/server.js"' package.json; then
        pass "Start script correctly configured"
    else
        warn "Start script may not be configured correctly"
    fi
else
    fail "package.json not found"
fi

# Check render.yaml
if [ -f "render.yaml" ]; then
    pass "render.yaml exists"
else
    warn "render.yaml not found (but can be created in Render dashboard)"
fi

echo ""
echo "🔐 SECURITY CHECKS"
echo "------------------"

# Check for exposed secrets in code
if grep -r "JWT_SECRET=" --include="*.js" --include="*.ts" --exclude-dir=node_modules --exclude-dir=.git . 2>/dev/null | grep -v "process.env.JWT_SECRET" > /dev/null; then
    fail "Hardcoded secrets found in code!"
    echo "  Run: grep -r 'JWT_SECRET=' --include='*.js' to find them"
else
    pass "No hardcoded JWT_SECRET in code"
fi

# Check for API keys/tokens in .env.example
if grep -E "(SECRET|TOKEN|PASSWORD)=" .env.example 2>/dev/null | grep -v "CHANGE_ME" | grep -v "your-" > /dev/null 2>&1; then
    warn "Real credentials may be in .env.example (should use placeholders)"
else
    pass ".env.example uses placeholder values"
fi

echo ""
echo "📦 DEPENDENCIES"
echo "---------------"

if [ -f "package-lock.json" ]; then
    pass "package-lock.json exists (dependencies locked)"
else
    warn "package-lock.json not found (run 'npm install')"
fi

# Check if critical dependencies are installed
if [ -d "node_modules" ]; then
    pass "node_modules directory exists"
    
    # Check for critical packages
    critical_packages=("express" "dotenv" "@libsql/client" "helmet" "cors")
    for pkg in "${critical_packages[@]}"; do
        if [ -d "node_modules/$pkg" ]; then
            pass "  └─ $pkg installed"
        else
            warn "  └─ $pkg NOT installed (run 'npm install')"
        fi
    done
else
    fail "node_modules not found - run 'npm install'"
fi

echo ""
echo "⚙️ APPLICATION CHECKS"
echo "---------------------"

# Check server.js
if [ -f "server/server.js" ]; then
    pass "server/server.js exists"
    
    # Check for PORT usage
    if grep -q "process.env.PORT" server/server.js; then
        pass "Uses process.env.PORT (Render compatible)"
    else
        fail "Doesn't use process.env.PORT (hardcoded port?)"
    fi
else
    fail "server/server.js not found"
fi

# Check for health endpoint
if grep -r "'/api/health'" server/routes/ 2>/dev/null | grep -q "router"; then
    pass "Health check endpoint configured (/api/health)"
else
    warn "Health check endpoint may not be configured"
fi

# Check app.js
if [ -f "server/app.js" ]; then
    pass "server/app.js exists"
    
    # Check for helmet
    if grep -q "helmet" server/app.js; then
        pass "  └─ Security headers (helmet) enabled"
    else
        warn "  └─ Security headers (helmet) not found"
    fi
    
    # Check for CORS
    if grep -q "cors" server/app.js; then
        pass "  └─ CORS configured"
    else
        warn "  └─ CORS not found"
    fi
else
    fail "server/app.js not found"
fi

echo ""
echo "📝 ENVIRONMENT VARIABLES"
echo "------------------------"

# Check .env file existence
if [ -f ".env" ]; then
    info ".env file exists (remove before committing!)"
    info "Check what's in it:"
    
    # List important vars (hide actual values)
    if grep -q "TURSO_CONNECTION_URL" .env; then
        pass "  └─ TURSO_CONNECTION_URL is set"
    else
        fail "  └─ TURSO_CONNECTION_URL is NOT set"
    fi
    
    if grep -q "TURSO_AUTH_TOKEN" .env; then
        pass "  └─ TURSO_AUTH_TOKEN is set"
    else
        fail "  └─ TURSO_AUTH_TOKEN is NOT set"
    fi
    
    if grep -q "JWT_SECRET" .env; then
        pass "  └─ JWT_SECRET is set"
    else
        fail "  └─ JWT_SECRET is NOT set"
    fi
else
    warn ".env file not found (create from .env.example for local testing)"
fi

echo ""
echo "🧪 RUNTIME CHECKS"
echo "-----------------"

# Try to start the server (with timeout)
if command -v timeout &> /dev/null; then
    info "Attempting to start server (30 second timeout)..."
    
    if timeout 5 npm start 2>&1 | grep -q "listening on"; then
        pass "Server starts successfully"
    elif timeout 5 npm start 2>&1 | grep -q "Error"; then
        fail "Server failed to start - check logs"
    else
        warn "Could not determine if server started (check logs)"
    fi
else
    info "Skipping runtime check (timeout command not available)"
fi

echo ""
echo "📊 SUMMARY"
echo "=========="
echo ""
echo -e "Passed: ${GREEN}$passed${NC}"
echo -e "Failed: ${RED}$failed${NC}"
echo -e "Warnings: ${YELLOW}$warnings${NC}"
echo ""

if [ $failed -eq 0 ]; then
    echo -e "${GREEN}✓ Ready for Render deployment!${NC}"
    exit 0
else
    echo -e "${RED}✗ Fix the issues above before deploying${NC}"
    exit 1
fi
