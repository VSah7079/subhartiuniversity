# Swami Vivekanand Subharti University — MERN Student ERP Portal

A full-stack **MERN** (MongoDB, Express.js, React.js, Node.js) implementation of the **Swami Vivekanand Subharti University (ERP Student Login)** system.

---

## 🏗️ Architecture

```
e:\Login page\
├── server/                    # Node.js + Express Backend
│   ├── config/db.js           # Mongoose MongoDB connection & fallback
│   ├── models/Student.js      # Student Schema & Mongoose Model
│   ├── controllers/
│   │   └── authController.js  # JWT Student login & profile logic
│   ├── routes/authRoutes.js   # POST /student-login, GET /profile
│   ├── middleware/
│   │   └── authMiddleware.js  # JWT protection middleware
│   ├── seed.js                # Database seeder script
│   ├── .env                   # PORT=5000, MONGO_URI, JWT_SECRET
│   ├── package.json           # Backend dependencies
│   └── server.js              # Express app entrypoint
│
├── client/                    # React 18 + Vite Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx           # Top university accreditation bar
│   │   │   ├── SidePanel.jsx        # SVSU Crest & institutional details
│   │   │   ├── LoginForm.jsx        # Dynamic option switcher, DOB mask, validation
│   │   │   ├── SwitchUserModal.jsx  # Multi-role login switcher
│   │   │   └── StudentDashboard.jsx # Authenticated Student Dashboard & Actions
│   │   ├── App.jsx            # State manager & JWT session handler
│   │   ├── App.css            # Responsive academic styling & theme
│   │   └── main.jsx           # React DOM root
│   ├── vite.config.js         # Vite config with backend proxy (/api -> :5000)
│   ├── index.html             # HTML5 template
│   └── package.json           # Frontend dependencies
│
├── README.md                  # Project documentation
└── package.json               # Root scripts
```

---

## ⚡ Quick Start Guide

### Step 1: Install Dependencies
Open a terminal in `e:\Login page`:

```bash
# Install Server dependencies
cd server
npm install

# Install Client dependencies
cd ../client
npm install
```

### Step 2: Start the Backend Server (Express + MongoDB)
```bash
cd server
npm run dev
```
> Server runs on: `http://localhost:5000`
> *Note: If MongoDB is running locally, it connects automatically to `mongodb://127.0.0.1:27017/svsu_erp`. If MongoDB is offline, it activates the built-in mock mode with seed students for instant testing!*

### Step 3: Start the Frontend Client (React + Vite)
In a new terminal window:
```bash
cd client
npm run dev
```
> Client runs on: `http://localhost:5173`

---

## 🚀 Single-Command Production Mode

Agar aap pure project ko **Production Mode** me ek hi port par run karna chahte hain (bina Vite dev server ke, directly Express se optimized bundle serve karne ke liye):

```bash
# Root directory me run karein:
npm run prod
```
Is command se:
1. React client ka optimized, chunk-split production bundle compile hota hai (`client/dist`).
2. Express backend `http://localhost:5000` par start hota hai aur wahi se poori website, API, security headers aur assets serve karta hai!

---

## 🧪 Demo Test Credentials

Aap login form par diye gaye **"⚡ One-click Demo"** buttons par click karke ya neeche diye gaye credentials enter karke test kar sakte hain:

| Login Option | Identifier | Date of Birth (DDMMYYYY) | Student Name | Course |
| :--- | :--- | :--- | :--- | :--- |
| **Enrollment No** | `SVSU/2023/10892` | `15082002` (15/08/2002) | Aarav Sharma | B.Tech CSE (Sem 5) |
| **Student ID** | `STU984322` | `22042003` (22/04/2003) | Priya Verma | BCA (Sem 3) |
| **Roll Number** | `220810103` | `10122001` (10/12/2001) | Mohammad Zaid | MBA (Sem 4) |

---

## 🔌 API Endpoints

- `POST /api/auth/student-login`: Authenticates student via `loginOption`, `identifier`, and `dob`. Returns signed JWT token and profile data.
- `GET /api/auth/profile`: Protected route returning authenticated student record (`Authorization: Bearer <token>`).
- `GET /api/health`: Health status of ERP backend and database connectivity.
- `POST /api/auth/logout`: Invalidates session.

---

## 🌟 Key MERN Highlights
1. **Dynamic Login Options**: Supports Enrollment No, Student ID, Roll No, and Registration No.
2. **Auto-formatting DOB Input**: Clean user experience with `DD / MM / YYYY` visual mask + native calendar picker.
3. **Student ERP Dashboard**: Once authenticated, switches to an interactive student portal showing real-time attendance, CGPA, semester details, and downloadable academic receipts.
4. **JWT Security**: Protected routes and persistent session management via `localStorage`.
