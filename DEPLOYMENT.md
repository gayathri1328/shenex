# SHENEX ✦ Deployment & Public Live URL Guide

This guide details how to deploy the **SHENEX Spatial Intelligence Platform** to get public live URLs for your GitHub profile and portfolio.

---

## 🌟 Architecture Overview

SHENEX is architected with a decoupled, high-performance production design:

| Component | Technology | Hosting Platform | Typical Public URL |
| :--- | :--- | :--- | :--- |
| **Frontend** | React 18 + Vite | **Vercel** (Global Edge CDN) | `https://shenex.vercel.app` |
| **CV Backend** | FastAPI + Ultralytics YOLOv8 + ByteTrack | **Render** (Python Web Service) | `https://shenex-backend.onrender.com` |
| **Database/Auth** | Supabase + Local Storage Resilient Fallback | **Supabase** / Client Local | Configured via env |

---

## 🚀 Part 1: Deploy Backend on Render (render.com)

Render hosts the Python FastAPI server with real Ultralytics YOLOv8, ByteTrack, and OpenCV.

### Step 1: Push latest changes to GitHub
Ensure the deployment files are pushed to your repository:
```bash
git add .
git commit -m "chore: add production deployment configurations for Render and Vercel"
git push origin main
```

### Step 2: Create Web Service on Render
1. Go to [dashboard.render.com](https://dashboard.render.com/) and sign in.
2. Click **New +** → **Web Service**.
3. Connect your GitHub repository: `https://github.com/gayathri1328/shenex`.
4. Configure the settings:
   - **Name**: `shenex-backend` (or your choice)
   - **Region**: Oregon (US West) or Frankfurt (EU)
   - **Branch**: `main`
   - **Runtime**: `Python 3`
   - **Build Command**:
     ```bash
     pip install --upgrade pip && pip install -r backend/requirements.txt
     ```
   - **Start Command**:
     ```bash
     uvicorn backend.app:app --host 0.0.0.0 --port $PORT
     ```
   - **Instance Type**: `Free`
5. Click **Create Web Service**.

> **Automatic Blueprint Alternative**:
> You can also click **New +** → **Blueprint** on Render and select this repository. Render will automatically read `render.yaml` and configure everything with one click!

### Step 3: Verify Backend
Once deployed, Render provides a URL like:
`https://shenex-backend.onrender.com`

Verify it by opening:
`https://shenex-backend.onrender.com/api/health`

It should return:
```json
{
  "status": "online",
  "service": "SHENEX Real Computer Vision Pipeline",
  "model": "Ultralytics YOLOv8n + ByteTrack",
  "person_class_only": true,
  "zero_biometrics": true,
  "version": "2.0.0"
}
```

---

## 🌐 Part 2: Deploy Frontend on Vercel (vercel.com)

Vercel provides lightning-fast global CDN delivery, automated HTTPS, and continuous deployments.

### Step 1: Import Project into Vercel
1. Go to [vercel.com](https://vercel.com/) and log in with your GitHub account.
2. Click **Add New…** → **Project**.
3. Select your repository: `gayathri1328/shenex`.
4. Vercel automatically detects **Vite** framework and `dist` output.

### Step 2: Configure Environment Variables
Under **Environment Variables**, add:
- **`VITE_API_URL`**: `https://shenex-backend.onrender.com` *(use your actual Render backend URL)*
- *(Optional)* **`VITE_SUPABASE_URL`**: *(Your Supabase project URL if using cloud Supabase)*
- *(Optional)* **`VITE_SUPABASE_ANON_KEY`**: *(Your Supabase anon public key)*

> **Note**: If Supabase variables are left empty, SHENEX automatically falls back to its built-in client-side persistence mode.

### Step 3: Click Deploy
1. Click **Deploy**.
2. Within 60 seconds, your site is live at:
   `https://shenex.vercel.app` (or your assigned Vercel URL).

---

## 📦 Part 3 (Alternative): All-in-One Deployment on Render

If you prefer a **single public URL** hosting both the frontend and backend together:

1. Build the frontend locally or via CI:
   ```bash
   npm run build
   ```
2. The FastAPI service in `backend/app.py` has built-in SPA static mounting for `dist/`.
3. In Render Web Service settings, set the **Build Command** to:
   ```bash
   npm install && npm run build && pip install -r backend/requirements.txt
   ```
   and **Start Command** to:
   ```bash
   uvicorn backend.app:app --host 0.0.0.0 --port $PORT
   ```
4. Render will serve both the React web application and all `/api` endpoints on one single domain!

---

## 📋 Production Readiness Checklist

- [x] Ultralytics YOLOv8n loads automatically without local file dependencies
- [x] Dynamic cloud `PORT` binding (`0.0.0.0:$PORT`)
- [x] CORS middleware enabled for cross-origin requests
- [x] Dynamic `VITE_API_URL` environment configuration with `/api` fallback
- [x] Client-side SPA routing rewrite rules configured (`vercel.json`)
- [x] Infrastructure-as-Code blueprint added (`render.yaml`)
- [x] Multi-platform Docker container definition (`Dockerfile`)
- [x] Zero mock fallbacks — real computer vision inference pipeline preserved
