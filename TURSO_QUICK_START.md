# TURSO MIGRATION - QUICK ACTION CHECKLIST

Follow these steps in order. Each step is ~2-5 minutes.

---

## ✅ PHASE 1: Setup (10 minutes)

### [ ] Step 1: Install Turso CLI
```bash
curl -sSfL https://get.tur.so/install.sh | bash
turso --version
```
**Expected**: Version number appears (e.g., 0.88.0)

### [ ] Step 2: Create Turso Account
Visit: https://turso.tech → Sign up (free)

### [ ] Step 3: Authenticate CLI
```bash
turso auth login
```
**Expected**: Browser opens, you authenticate, terminal confirms

---

## ✅ PHASE 2: Create Database (5 minutes)

### [ ] Step 4: Create Turso Database
```bash
turso db create rodb-news
```
**Save this output:**
```
Database URL: libsql://rodb-news-<YOUR_USERNAME>.turso.io
```

### [ ] Step 5: Generate Auth Token
```bash
turso db tokens create rodb-news
```
**Save this output:**
```
Token: <YOUR_AUTH_TOKEN_HERE>
```

---

## ✅ PHASE 3: Migrate Data (10 minutes)

### [ ] Step 6: Dump Local Database
```bash
sqlite3 /home/arcgg/rodb/server/data/rodb.db ".dump" > /tmp/rodb_export.sql
ls -lh /tmp/rodb_export.sql
```
**Expected**: File size ~5-10MB

### [ ] Step 7: Upload to Turso
```bash
turso db shell rodb-news < /tmp/rodb_export.sql
```
**Expected**: No errors (may take 1-2 minutes)

### [ ] Step 8: Verify Data Migrated
```bash
turso db shell rodb-news "SELECT COUNT(*) as articles FROM articles;"
turso db shell rodb-news "SELECT COUNT(*) as users FROM users;"
```
**Expected**: Shows row counts (not 0)

---

## ✅ PHASE 4: Update Code (5 minutes)

### [ ] Step 9: Install Turso Client
```bash
cd /home/arcgg/rodb
npm install @libsql/client
```
**Expected**: Package added to node_modules, package-lock.json updated

### [ ] Step 10: Create New Database Module
Files already created:
- ✅ `server/config/turso-database.js` (new module)

### [ ] Step 11: Backup Old Database Module
```bash
mv /home/arcgg/rodb/server/config/database.js /home/arcgg/rodb/server/config/database.js.backup
cp /home/arcgg/rodb/server/config/turso-database.js /home/arcgg/rodb/server/config/database.js
```
**Expected**: `database.js` now contains Turso code

---

## ✅ PHASE 5: Configure Environment (5 minutes)

### [ ] Step 12: Update .env File
Edit `/home/arcgg/rodb/.env` and add/update:
```bash
TURSO_CONNECTION_URL=libsql://rodb-news-<YOUR_USERNAME>.turso.io
TURSO_AUTH_TOKEN=<YOUR_AUTH_TOKEN_HERE>
NODE_ENV=production
PORT=3000
```

**Replace with YOUR values from Step 4 & 5**

---

## ✅ PHASE 6: Test Locally (10 minutes)

### [ ] Step 13: Start App Locally
```bash
cd /home/arcgg/rodb
npm start
```
**Expected Output:**
```
[INFO] Connecting to Turso database...
[INFO] ✅ Successfully connected to Turso database
[INFO] Server running on http://0.0.0.0:3000
```

### [ ] Step 14: Test API Endpoints
Open new terminal, run:
```bash
# Test 1: Health check
curl http://localhost:3000/api/health

# Test 2: Get articles
curl http://localhost:3000/api/articles | head -100

# Test 3: Get categories
curl http://localhost:3000/api/categories
```
**Expected**: JSON responses (not errors)

### [ ] Step 15: Test Database Write
```bash
# Via admin panel: Create/edit/delete an article
# OR via API:
curl -X POST http://localhost:3000/api/articles \
  -H "Content-Type: application/json" \
  -d '{"headline":"Test","body":"Test body","status":"draft"}'
```

### [ ] Step 16: Verify Write in Turso
```bash
turso db shell rodb-news "SELECT headline FROM articles ORDER BY id DESC LIMIT 1;"
```
**Expected**: Shows the article you just created

---

## ✅ PHASE 7: Deploy to Render (10 minutes)

### [ ] Step 17: Commit & Push Code
```bash
cd /home/arcgg/rodb
git add .
git commit -m "Migrate to Turso persistent database"
git push origin main
```
**Expected**: Changes pushed to GitHub

### [ ] Step 18: Update Render Environment
Go to: https://dashboard.render.com
- Select your `rodb-news` service
- Go to **Settings** → **Environment**
- **Remove**: `DB_PATH=/tmp/rodb.db`
- **Add/Update** these variables:
  ```
  TURSO_CONNECTION_URL = libsql://rodb-news-<YOUR_USERNAME>.turso.io
  TURSO_AUTH_TOKEN = <YOUR_TOKEN> (mark as SECRET)
  ```
- Click **Save Changes**

### [ ] Step 19: Manual Deploy
- In Render dashboard, click **Manual Deploy**
- Wait for deployment (2-3 minutes)
**Expected**: Status changes to "Live"

### [ ] Step 20: Test on Render
```bash
# Replace with YOUR Render URL
curl https://rodb-news-<YOUR_NAME>.onrender.com/api/health
curl https://rodb-news-<YOUR_NAME>.onrender.com/api/articles
```
**Expected**: JSON responses (same as local)

---

## ✅ PHASE 8: Verify Persistence (5 minutes per test)

### [ ] Test 1: Restart Instance
- Render dashboard → **Restart Instance**
- Wait 30 seconds
- Test: `curl https://rodb-news-xxx.onrender.com/api/articles`
**Expected**: Data unchanged ✅

### [ ] Test 2: Add Data → Redeploy
- Add article via admin panel
- Push a code change: `git commit --allow-empty -m "test" && git push`
- Wait for redeploy
- Verify article still exists
**Expected**: Data preserved ✅

### [ ] Test 3: After Inactivity
- Wait 15+ minutes (Render free tier sleeps)
- Make a request to wake app
- Query database
**Expected**: All data intact ✅

---

## ✅ VERIFICATION CHECKLIST

After all steps, verify:

- [ ] Turso database created
- [ ] Auth token generated
- [ ] Local database dumped & uploaded
- [ ] Article count matches (both local → Turso)
- [ ] User count matches
- [ ] npm package installed (`npm list @libsql/client`)
- [ ] `server/config/database.js` contains Turso code
- [ ] `.env` has both `TURSO_*` variables set
- [ ] Local app starts and connects
- [ ] API endpoints work locally
- [ ] Can read data from Turso
- [ ] Can write data to Turso
- [ ] Render environment variables set
- [ ] Render app deployed successfully
- [ ] Render app connects to Turso
- [ ] Data persists after restart
- [ ] Data persists after redeploy

**If all checks pass: 🎉 MIGRATION COMPLETE**

---

## 🆘 TROUBLESHOOTING

### App won't start: "TURSO_CONNECTION_URL not set"
→ Add variables to `.env` file (Step 12)

### Turso connection fails: "401 Unauthorized"
→ Check auth token is correct (Step 5)
→ Regenerate: `turso db tokens create rodb-news`

### No data in Turso
→ Check dump was uploaded: `turso db shell rodb-news "SELECT COUNT(*) FROM articles;"`
→ If 0, re-run Step 6-7

### Render deployment fails
→ Check build logs in Render dashboard
→ Verify `.env` variables are set
→ Try **Restart Instance** then **Manual Deploy**

### Queries return empty in production
→ Verify Turso credentials in Render (they're correct locally)
→ Check Turso tokens haven't expired
→ Regenerate token and update Render

---

## TOTAL TIME ESTIMATE

| Phase | Time |
|-------|------|
| Setup & Account | 10 min |
| Create Database | 5 min |
| Migrate Data | 10 min |
| Update Code | 5 min |
| Configure Env | 5 min |
| Test Locally | 10 min |
| Deploy to Render | 10 min |
| Verify Persistence | 5 min |
| **TOTAL** | **~60 minutes** |

---

## WHAT YOU GET

✅ **Persistent Database**
- Survives Render pauses ✅
- Survives redeploys ✅
- Survives scaling ✅
- Survives restarts ✅

✅ **Zero Code Changes to**
- Controllers
- Models
- Routes
- Frontend

✅ **Same SQL Queries**
- All existing queries work unchanged
- No migration code needed
- Drop-in replacement

✅ **Free Forever (For Your Use Case)**
- 300 databases included
- 9GB per database (you use ~300MB)
- Unlimited API calls
- Cost: $0/month

---

**Ready? Start at Step 1!**
