# 🚀 Render Deployment Guide

## Deploy Your Workflow Automation Platform on Render

### Overview
You'll deploy two services:
1. **Frontend** (Static Site) - React/Vite app
2. **Backend** (Web Service) - Python FastAPI email service

---

## Part 1: Deploy Frontend (Static Site)

### Step 1: Create Static Site

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New"** → **"Static Site"**
3. Connect your GitHub repository
4. Configure:

   **Basic Settings:**
   - **Name**: `workflow-automation-frontend` (or your choice)
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: `Mini_Project-main/Blank-main`
   - **Build Command**: `npm install; npm run build`
   - **Publish Directory**: `dist`

### Step 2: Add Environment Variables

Click **"Advanced"** and add:

| Key | Value |
|-----|-------|
| `VITE_GOOGLE_CLIENT_ID` | `460454436602-4cos0ped4vgalbss8bmjkmsl9loccadf.apps.googleusercontent.com` |
| `VITE_API_URL` | `https://your-backend-url.onrender.com` (add after backend is deployed) |

### Step 3: Deploy

1. Click **"Create Static Site"**
2. Wait for build to complete (2-5 minutes)
3. Note your frontend URL: `https://your-app.onrender.com`

---

## Part 2: Deploy Backend (Web Service)

### Step 1: Create Web Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:

   **Basic Settings:**
   - **Name**: `workflow-automation-backend`
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python send_email_simple.py`

### Step 2: Add Environment Variables

Add these from your `backend/.env`:

| Key | Value |
|-----|-------|
| `SMTP_USER` | `yadavanushka759@gmail.com` |
| `SMTP_PASS` | `lkjcpnqvgggbgnbl` |
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `465` |

### Step 3: Deploy

1. Click **"Create Web Service"**
2. Wait for deployment (2-5 minutes)
3. Note your backend URL: `https://your-backend.onrender.com`

---

## Part 3: Connect Frontend to Backend

### Update Frontend Environment Variable

1. Go to your **Frontend Static Site** in Render
2. Click **"Environment"**
3. Update `VITE_API_URL` to your backend URL:
   ```
   https://your-backend.onrender.com
   ```
4. Click **"Save Changes"**
5. Render will automatically redeploy

### Update Backend CORS

Update `backend/send_email_simple.py` to allow your frontend domain:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://your-app.onrender.com",  # Add your Render frontend URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Commit and push - Render will auto-deploy.

---

## Part 4: Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Select your OAuth 2.0 Client ID
3. Add to **Authorized JavaScript origins**:
   ```
   https://your-app.onrender.com
   ```
4. Add to **Authorized redirect URIs**:
   ```
   https://your-app.onrender.com
   ```
5. Click **Save**

---

## Testing Your Deployment

1. Visit your frontend URL: `https://your-app.onrender.com`
2. Test Google OAuth login
3. Create a workflow
4. Test email sending
5. Check scheduled emails

---

## Important Notes

### Free Tier Limitations
- **Static Sites**: Always on, fast CDN delivery ✅
- **Web Services**: Spin down after 15 minutes of inactivity
  - First request after sleep takes ~30 seconds to wake up
  - Consider upgrading to paid plan for production

### Keep Backend Alive (Optional)
To prevent backend from sleeping, use a service like:
- [UptimeRobot](https://uptimerobot.com/) - Free pings every 5 minutes
- [Cron-job.org](https://cron-job.org/) - Free scheduled requests

### Custom Domain (Optional)
1. Go to your Static Site → Settings → Custom Domain
2. Add your domain
3. Configure DNS as instructed
4. Update Google OAuth with new domain

---

## Troubleshooting

### Build Fails
- Check build logs in Render dashboard
- Verify Root Directory is correct
- Ensure `package.json` exists in specified directory

### Backend Not Responding
- Check if service is sleeping (free tier)
- View logs in Render dashboard
- Verify environment variables are set

### Email Not Sending
- Check backend logs for SMTP errors
- Verify Gmail App Password is correct
- Ensure SMTP ports aren't blocked

### Google OAuth Fails
- Verify authorized origins in Google Console
- Check `VITE_GOOGLE_CLIENT_ID` is correct
- Clear browser cache

### CORS Errors
- Verify frontend URL is in backend CORS settings
- Check backend logs for blocked requests
- Ensure both services are deployed

---

## Deployment Checklist

**Frontend:**
- [ ] Static Site created
- [ ] Root Directory set to `Mini_Project-main/Blank-main`
- [ ] Build command: `npm install; npm run build`
- [ ] Publish directory: `dist`
- [ ] Environment variables added
- [ ] Deployment successful

**Backend:**
- [ ] Web Service created
- [ ] Root Directory set to `backend`
- [ ] Build command: `pip install -r requirements.txt`
- [ ] Start command: `python send_email_simple.py`
- [ ] Environment variables added
- [ ] Deployment successful

**Configuration:**
- [ ] Frontend `VITE_API_URL` points to backend
- [ ] Backend CORS allows frontend URL
- [ ] Google OAuth configured with Render URLs
- [ ] All features tested and working

---

## Quick Commands

**Test build locally before deploying:**
```bash
# Frontend
cd Mini_Project-main/Blank-main
npm install
npm run build

# Backend
cd backend
pip install -r requirements.txt
python send_email_simple.py
```

---

**Need Help?** Check [Render Documentation](https://render.com/docs) or contact support.
