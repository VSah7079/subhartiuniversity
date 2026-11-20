# 🚀 Swami Vivekanand Subharti University ERP - Hostinger Production Deployment Guide

Yeh guide aapko aapke **MERN Stack ERP Portal** ko **Hostinger** par step-by-step 100% production-ready live karne ka complete tarika batati hai.

---

## 📌 Hostinger Deployment Overview

Hostinger par do tarike se deploy kiya ja sakta hai:
1. **Method A (Most Popular & Easy)**: **Hostinger Web Hosting / Cloud Hosting** (hPanel ke **Node.js Application** feature ke dwara).
2. **Method B (Full Control)**: **Hostinger VPS** (Ubuntu Linux + PM2 + Nginx Reverse Proxy + SSL).

> [!IMPORTANT]
> **MongoDB Database Note (Important for Hostinger):**
> Hostinger ke shared/cloud servers par local MongoDB install nahi hota (waha sirf MySQL hota hai). Isliye production me **MongoDB Atlas** (official cloud database jo bilkul **FREE** hai) use hota hai. Setup sirf 2 minute ka hai.

---

## 🗄️ Step 0: Free MongoDB Atlas Cloud Database Setup (2 Minutes)

1. [cloud.mongodb.com](https://cloud.mongodb.com) par jayein aur Free Account banayein (ya Google se sign in karein).
2. **Create a Deployment**: **M0 Free Cluster** select karein (Region: *AWS Mumbai ap-south-1* ya Europe/US).
3. **Security Quickstart**:
   - **Username** aur **Password** set karein (jaise: `svsu_admin` aur ek strong password). Is password ko yaad rakhein!
   - **Network Access**: IP Access List me `0.0.0.0/0` (Allow Access from Anywhere) add karein taaki Hostinger server connect ho sake.
4. **Connection String Copy karein**:
   - Cluster dashboard par **"Connect"** button dabayein ➔ **"Drivers" (Node.js)** select karein.
   - Aapko ek string milegi jaise:
     ```
     mongodb+srv://svsu_admin:<password>@cluster0.abcde.mongodb.net/svsu_erp?retryWrites=true&w=majority
     ```
   - `<password>` ki jagah apna actual password likhein. Yeh aapka production `MONGO_URI` hai!

---

## 📦 Method A: Hostinger Web / Cloud Hosting (hPanel Node.js)

Aapke project me ek automated packaging script bana di gayi hai jo sirf production files ka **~370 KB** ka super-lightweight zip banati hai (bina heavy `node_modules` ke, jo 1 second me upload ho jata hai).

### 1. Ready-to-Upload ZIP File Banayein (Local Computer par)
Aapke project folder me:
- **`prepare_hostinger_deploy.bat`** par double click karein (ya terminal me `powershell -File prepare_hostinger_deploy.ps1` chalayein).
- Yeh command automatically latest React code build karegi aur root me **`hostinger_deploy.zip`** generate kar degi.

---

### 2. Hostinger File Manager me Upload & Extract karein
1. Hostinger **hPanel** open karein ➔ **Websites** ➔ Apni website ke samne **"Manage"** par click karein.
2. Left menu me **Files** ➔ **File Manager** par click karein.
3. Apni domain directory (jaise `public_html` ya subfolder) me jayein.
4. Top right par **Upload** icon dabayein aur **`hostinger_deploy.zip`** upload karein.
5. Upload hone ke baad zip par Right-Click karein ➔ **Extract** select karein (current directory me).
6. Extraction ke baad aapko yeh files dikhengi:
   - `index.js`
   - `server.js`
   - `package.json`
   - `.htaccess`
   - `.env`
   - `ecosystem.config.js`
   - `server/` (controllers, models, routes, config)
   - `client/dist/` aur `dist/` (compiled frontend)

---

### 3. `.env` File Configure karein
1. File Manager me `.env` file ko right click karke **Edit** karein.
2. Yeh values update karein:
   ```env
   PORT=5001
   NODE_ENV=production
   MONGO_URI=mongodb+srv://svsu_admin:AapkaPassword@cluster0.abcde.mongodb.net/svsu_erp?retryWrites=true&w=majority
   JWT_SECRET=svsu_production_jwt_secret_token_subharti_2026_secure
   JWT_EXPIRES_IN=7d
   ```
3. **Save** par click karein.

---

### 4. hPanel me "Node.js Application" Setup karein
1. hPanel dashboard me search karein ya scroll karein: **Advanced** ➔ **Node.js** (ya **Web Applications** ➔ **Node.js**).
2. **Create Application** par click karein:
   - **Node.js Version**: `18.x` ya `20.x` (LTS recommended)
   - **Application Mode**: `Production`
   - **Application Root**: Apni directory select karein (e.g. `public_html`)
   - **Application Startup File**: `index.js` (ya `server.js`)
   - **Application URL**: Apni domain select karein
3. **Create** button dabayein.

---

### 5. Dependencies Install karein & Start karein
1. Node.js App page par **"NPM Install"** button par click karein.
   *(Hostinger automatically `package.json` se saari dependencies install kar lega).*
2. Page ke top par **"Restart"** ya **"Start App"** button dabayein.
3. Status **Running (Active)** ho jayega!

---

### 6. Verify karein
Apne browser me apni domain kholein (e.g., `https://yourdomain.com`):
- **Health Check**: `https://yourdomain.com/api/health` ➔ JSON response dikhega: `{"status":"online", "database":"Connected (MongoDB)"}`.
- **Login Portal**: 1:1 SVSU student login screen load hogi.
- **Demo Login**:
  - Enrollment No: `SVSU/2023/10892`
  - DOB: `15/08/2002` (ya format: `15082002`)
- **Admin Editor**: Top navbar me **⚙️ Admin Editor** button se pura data live modify kar sakte hain!

---

## 🖥️ Method B: Hostinger VPS Hosting (Ubuntu 22.04 / 24.04 LTS)

Agar aapke paas **Hostinger VPS** hai:

### 1. VPS me Node.js & Nginx Install karein
SSH ke dwara apne VPS me login karein:
```bash
# System Update
sudo apt update && sudo apt upgrade -y

# Node.js 20 LTS Install
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs nginx git

# PM2 Global Process Manager Install
sudo npm install -g pm2
```

### 2. Code Deploy karein
```bash
# Project directory banayein
mkdir -p /var/www/svsu-erp
cd /var/www/svsu-erp

# Git clone karein ya hostinger_deploy.zip upload karke unzip karein
# unzip hostinger_deploy.zip

# Production dependencies install karein
npm install --production

# .env file setup karein
nano .env
# (Upar diye gaye MONGO_URI, JWT_SECRET, PORT=5001 paste karein aur save karein)
```

### 3. PM2 Cluster Start karein
```bash
# Cluster start karein
pm2 start ecosystem.config.js

# Server restart par auto-start enable karein
pm2 save
pm2 startup
```

### 4. Nginx Reverse Proxy Configure karein
Aapke project me ready-to-use **`hostinger_nginx.conf`** provided hai:
```bash
sudo cp hostinger_nginx.conf /etc/nginx/sites-available/svsu_erp
# Apni domain name update karein
sudo nano /etc/nginx/sites-available/svsu_erp

# Site enable karein
sudo ln -s /etc/nginx/sites-available/svsu_erp /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 5. Free SSL (Let's Encrypt HTTPS) Install karein
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## 🛠️ Production Hardening Features Jo Automatically Included Hain

1. **Flexible Path Resolution**: Express backend automatically detect karta hai ki frontend static files `client/dist`, `dist`, ya `public_html` me hai.
2. **Gzip / Deflate Compression**: `compression` middleware se HTML, CSS, JS aur JSON responses 75% tak compress ho kar instant load hote hain.
3. **Security Headers**: HSTS, X-Content-Type-Options: nosniff, X-Frame-Options: SAMEORIGIN, aur X-XSS-Protection active hain.
4. **Resilient Port Binding**: Agar port 5001 busy ya unavailable ho, server automatically next available port par bind ho jata hai.
5. **Database Auto-Seeder**: Pehli baar run hone par default verified student records automatic MongoDB me insert ho jate hain.
6. **Graceful Shutdown**: SIGINT / SIGTERM signals par MongoDB connection properly close hota hai bina connection leak ke.
7. **Production `.htaccess`**: LiteSpeed/Apache ke liye HTTPS redirect, asset caching (1 year), aur SPA client-side routing fallback active hai.

---

## ❓ Frequently Asked Questions (Troubleshooting)

**Q1: "MongoDB connection warning / offline hybrid mode dikha raha hai?"**  
*Answer*: Check karein ki aapne `.env` me MongoDB Atlas ka connection string sahi se daala hai aur MongoDB Atlas me **Network Access** me `0.0.0.0/0` (Anywhere) allow kiya hua hai.

**Q2: "Hostinger par Page Refresh karne par 404 error aata hai?"**  
*Answer*: Provided `.htaccess` file aapke root directory me honi chahiye. Yeh automatically har request ko `index.html` par route karti hai taaki React Single-Page Application (SPA) smoothly chale.

**Q3: "Logo ya Marksheet print nahi ho raha?"**  
*Answer*: Humne logo ko 32-bit transparent PNG me convert karke `public/` aur `dist/` dono me place kar diya hai, isliye print aur downloads 100% offline aur online dono jagah perfect work karte hain.
