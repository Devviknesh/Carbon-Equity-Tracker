# Deployment Guide

## Prerequisites
- GitHub account
- Vercel account (free)
- Render account (free)
- Neon account (free) OR Railway account

---

## 1. Database — Neon PostgreSQL (Recommended)

1. Sign up at [neon.tech](https://neon.tech)
2. Create a new project → copy the connection string
3. Update `backend/prisma/schema.prisma` provider to `postgresql`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
4. Run migration: `npx prisma migrate deploy`

**Alternative: Railway MySQL**
1. Sign up at [railway.app](https://railway.app)
2. Add MySQL plugin → copy `DATABASE_URL`
3. Keep `provider = "mysql"` in schema — no changes needed

---

## 2. Backend — Render

1. Push code to GitHub
2. Go to [render.com](https://render.com) → **New Web Service**
3. Connect your GitHub repo
4. Settings:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install && npx prisma generate && npm run build`
   - **Start Command:** `node dist/index.js`
   - **Environment:** Node 20
5. Add Environment Variables:
   ```
   DATABASE_URL     = <your Neon/Railway URL>
   JWT_SECRET       = <64-char random string>
   NODE_ENV         = production
   ALLOWED_ORIGINS  = https://your-app.vercel.app
   PORT             = 5000
   ```
6. Deploy — copy the service URL (e.g., `https://carbon-api.onrender.com`)

---

## 3. Frontend — Vercel (Recommended)

1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import your GitHub repo
3. Settings:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Add Environment Variable:
   ```
   VITE_API_URL = https://carbon-api.onrender.com/api
   ```
5. Deploy — your app goes live at `https://your-app.vercel.app`

**Note:** Update `AuthContext.tsx` to use `import.meta.env.VITE_API_URL`:
```ts
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```

---

## 4. GitHub Actions CI/CD Setup

Add these secrets in **GitHub → Settings → Secrets → Actions**:

| Secret | Value |
|--------|-------|
| `VERCEL_TOKEN` | From vercel.com → Account Settings → Tokens |
| `VERCEL_ORG_ID` | From `.vercel/project.json` after `vercel link` |
| `VERCEL_PROJECT_ID` | From `.vercel/project.json` |
| `RENDER_DEPLOY_HOOK_URL` | From Render → Service → Settings → Deploy Hook |
| `VITE_API_URL` | `https://carbon-api.onrender.com/api` |

---

## 5. Docker Self-Hosted

```bash
# Clone
git clone https://github.com/YOUR/Carbon-Equity-Tracker.git
cd "Carbon Equity Tracker"

# Configure
echo "MYSQL_ROOT_PASSWORD=secure_pass" > .env
echo "JWT_SECRET=$(openssl rand -hex 32)" >> .env

# Build and run
docker-compose up --build -d

# Run DB migrations
docker-compose exec backend npx prisma migrate deploy
docker-compose exec backend npx ts-node prisma/seed.ts

# Access
open http://localhost:3000
```

---

## 6. Alternatives

| Layer | Primary | Alternative 1 | Alternative 2 |
|-------|---------|--------------|--------------|
| Frontend | Vercel | Netlify | AWS S3 + CloudFront |
| Backend | Render | Railway | AWS EC2 / Azure App Service |
| Database | Neon | Railway MySQL | AWS RDS |

### Netlify (Frontend Alternative)
1. Connect GitHub repo
2. Base directory: `frontend`
3. Build: `npm run build`, Publish: `dist`
4. Add `VITE_API_URL` env var
5. Add `_redirects` file: `/* /index.html 200`

### AWS (Advanced)
- Frontend: S3 bucket + CloudFront distribution
- Backend: Elastic Beanstalk or ECS Fargate
- Database: RDS MySQL/Aurora
- Use IAM roles and Parameter Store for secrets
