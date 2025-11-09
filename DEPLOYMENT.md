# 🚀 Deployment Guide - GramBazaar

Complete guide to deploy GramBazaar to production using free hosting services.

---

## 📋 Prerequisites

1. **GitHub Account** (free)
2. **Vercel Account** (sign up with GitHub - free)
3. **Render Account** (sign up with GitHub - free)
4. **MongoDB Atlas Account** (free)

---

## 🗄️ Step 1: Setup MongoDB Atlas (Database)

### 1.1 Create Account
- Go to: https://www.mongodb.com/cloud/atlas/register
- Sign up (free)

### 1.2 Create Cluster
1. Click "Build a Database"
2. Choose **FREE** tier (M0 Sandbox)
3. Select region closest to you
4. Click "Create Cluster"

### 1.3 Create Database User
1. Click "Database Access" (left sidebar)
2. Click "Add New Database User"
3. Username: `grambazaar`
4. Password: Generate secure password (copy it!)
5. User Privileges: "Read and write to any database"
6. Click "Add User"

### 1.4 Whitelist IP Addresses
1. Click "Network Access" (left sidebar)
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

### 1.5 Get Connection String
1. Click "Database" (left sidebar)
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Replace `<database>` with `grambazaar`

Example:
```
mongodb+srv://grambazaar:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/grambazaar?retryWrites=true&w=majority
```

**Save this connection string!** You'll need it for Render.

---

## 🔧 Step 2: Deploy Backend to Render

### 2.1 Push Code to GitHub
```cmd
cd c:\Users\souvi\Desktop\grambazaar
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/grambazaar.git
git push -u origin main
```

### 2.2 Create Render Account
- Go to: https://render.com
- Sign up with GitHub

### 2.3 Create Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Select `grambazaar` repo
4. Configuration:
   - **Name**: `grambazaar-api`
   - **Region**: Choose closest
   - **Branch**: `main`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

### 2.4 Add Environment Variables
Click "Advanced" → "Add Environment Variable"

Add these:
```
PORT = 5000
NODE_ENV = production
MONGODB_URI = your-mongodb-atlas-connection-string
JWT_SECRET = grambazaar-super-secret-jwt-key-2024
CLIENT_URL = https://grambazaar.vercel.app
EMAIL_USER = abc787286@gmail.com
EMAIL_PASS = oxhi mwyg xkvt ielo
```

### 2.5 Deploy
1. Click "Create Web Service"
2. Wait 5-10 minutes for deployment
3. Your API URL: `https://grambazaar-api.onrender.com`

**Test it**: Visit `https://grambazaar-api.onrender.com` in browser

---

## 🌐 Step 3: Deploy Frontend to Vercel

### 3.1 Create Vercel Account
- Go to: https://vercel.com/signup
- Sign up with GitHub

### 3.2 Import Project
1. Click "Add New..." → "Project"
2. Import your `grambazaar` repository
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 3.3 Add Environment Variable
Click "Environment Variables"

Add:
```
VITE_API_BASE = https://grambazaar-api.onrender.com
```

### 3.4 Deploy
1. Click "Deploy"
2. Wait 2-3 minutes
3. Your website: `https://grambazaar.vercel.app`

### 3.5 Update Backend CORS
Go back to Render → Environment Variables

Update `CLIENT_URL`:
```
CLIENT_URL = https://grambazaar.vercel.app
```

Click "Save Changes" → Render will auto-redeploy

---

## 🧪 Step 4: Test Production App

### 4.1 Visit Your App
Go to: `https://grambazaar.vercel.app`

### 4.2 Test Features
1. ✅ Browse shops
2. ✅ Register new account
3. ✅ Check email (welcome email should arrive)
4. ✅ Login
5. ✅ Add items to cart
6. ✅ Checkout
7. ✅ Forgot password (email should arrive)
8. ✅ View profile
9. ✅ Track orders

---

## 📱 Access from Phone

Now your app is accessible from **any device** worldwide:

- **Website**: `https://grambazaar.vercel.app`
- **API**: `https://grambazaar-api.onrender.com`

Open on:
- ✅ Phone browser (Android/iPhone)
- ✅ Tablet
- ✅ Any computer
- ✅ Share link with anyone!

---

## ⚙️ Post-Deployment

### Custom Domain (Optional)
**Vercel**:
1. Go to Project Settings → Domains
2. Add your domain (e.g., `grambazaar.com`)
3. Follow DNS configuration steps

**Render**:
1. Go to Dashboard → Settings → Custom Domain
2. Add domain and configure DNS

### Monitoring
**Vercel**: Built-in analytics
**Render**: View logs in dashboard
**MongoDB Atlas**: Monitor database usage

### Update Deployment
**Auto-deploy on git push**:
```cmd
git add .
git commit -m "Update"
git push
```
Both Vercel and Render will auto-deploy!

---

## 🔒 Security Checklist

- ✅ Change JWT_SECRET to random string
- ✅ Use strong MongoDB password
- ✅ Enable MongoDB Atlas IP whitelist
- ✅ Keep .env files private (never commit)
- ✅ Use HTTPS only (Vercel/Render provide free SSL)

---

## 💰 Free Tier Limits

**Vercel**:
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Perfect for demos

**Render**:
- ✅ 750 hours/month (enough for 24/7)
- ⚠️ Sleeps after 15 min inactivity
- ⚠️ Wakes up in 30-50 seconds on request

**MongoDB Atlas**:
- ✅ 512 MB storage
- ✅ Enough for thousands of users
- ✅ Shared cluster

---

## 🆘 Troubleshooting

**Backend won't start**:
- Check environment variables in Render
- Check MongoDB connection string
- View logs in Render dashboard

**Frontend can't connect to backend**:
- Check `VITE_API_BASE` in Vercel
- Check CORS settings in backend
- Verify `CLIENT_URL` in Render

**Emails not sending**:
- Check `EMAIL_USER` and `EMAIL_PASS`
- Verify Gmail App Password is correct

---

## 📚 Resources

- Vercel Docs: https://vercel.com/docs
- Render Docs: https://render.com/docs
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com
- Vite Deployment: https://vitejs.dev/guide/static-deploy.html

---

**Need help?** Check the error logs in Render/Vercel dashboards!

Good luck! 🚀
