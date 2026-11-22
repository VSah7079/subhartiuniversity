const path = require('path');
const fs = require('fs');
// Load environment variables from root or server directory
require('dotenv').config();
if (fs.existsSync(path.join(__dirname, '.env'))) {
  require('dotenv').config({ path: path.join(__dirname, '.env'), override: true });
}
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const compression = require('compression');
const { connectDB, getDbStatus } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { securityHeaders } = require('./middleware/security');

const app = express();
const PORT = process.env.PORT || 5000;

// Production Hardening: Disable Express fingerprinting & enable reverse proxy support
app.disable('x-powered-by');
app.set('trust proxy', 1);

// Gzip / Deflate payload compression for high performance
app.use(compression());

// Connect to MongoDB
connectDB();

// Security Headers Middleware
app.use(securityHeaders);

// Middleware
app.use(cors({
  origin: true, // Dynamically allow all origins including ngrok tunnels and local network
  credentials: true
}));
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    portal: 'Swami Vivekanand Subharti University ERP Authentication Service',
    database: getDbStatus() ? 'Connected (MongoDB)' : 'Hybrid Mock Active (MongoDB Offline)',
    timestamp: new Date().toISOString()
  });
});

// Serve frontend static build if available (flexible path resolution for Hostinger / VPS / local)
const candidateDistPaths = [
  path.join(__dirname, '../client/dist'),
  path.join(__dirname, '../dist'),
  path.join(__dirname, 'dist'),
  path.join(__dirname, '../../public_html'),
  path.join(__dirname, '../public_html')
];
const clientDistPath = candidateDistPaths.find(p => fs.existsSync(p));

if (clientDistPath) {
  console.log(`[Static Serving] Serving production frontend from: ${clientDistPath}`);
  // Fingerprinted bundle assets with 1-year immutable caching
  app.use('/assets', express.static(path.join(clientDistPath, 'assets'), {
    maxAge: '1y',
    immutable: true
  }));
  // Root static assets (images, favicon, etc.) with 1-hour caching
  app.use(express.static(clientDistPath, {
    maxAge: '1h'
  }));
  // Redirect root '/' to '/login/StudentLogin' for official student login URL
  app.get('/', (req, res) => {
    res.redirect(302, '/login/StudentLogin');
  });

  // Single-Page Application (SPA) client routing fallback
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
} else {
  // Root welcome endpoint if client is not built
  app.get('/', (req, res) => {
    res.send(`
      <div style="font-family:sans-serif; text-align:center; padding:50px;">
        <h2 style="color:#0f2137;">Swami Vivekanand Subharti University - ERP API</h2>
        <p style="color:#64748b;">Backend service running successfully on port ${PORT}.</p>
        <p>Endpoints: <code>POST /api/auth/student-login</code>, <code>GET /api/auth/profile</code></p>
      </div>
    `);
  });
}

// 404 Handler for undefined API routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API Route not found: ${req.method} ${req.originalUrl}`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Dynamic Port with Auto-Fallback (Production Resilient)
const initialPort = parseInt(process.env.PORT, 10) || 5001;

function startServer(portToUse) {
  const serverInstance = app.listen(portToUse, '0.0.0.0');

  serverInstance.on('listening', () => {
    console.log(`=======================================================`);
    console.log(`🚀 SVSU ERP Production Server running on port: ${portToUse}`);
    console.log(`🌐 Application URL: http://localhost:${portToUse}`);
    console.log(`📡 Health Check:    http://localhost:${portToUse}/api/health`);
    console.log(`🔑 Login API:       POST http://localhost:${portToUse}/api/auth/student-login`);
    console.log(`🛡️  Security:        Headers Active • Rate Limiter Active`);
    console.log(`📦 Mode:            ${process.env.NODE_ENV || 'production'}`);
    console.log(`=======================================================`);
  });

  serverInstance.on('error', (err) => {
    if (err.code === 'EADDRINUSE' || err.code === 'EACCES') {
      console.warn(`[Server] Port ${portToUse} is unavailable (${err.code}). Trying port ${portToUse + 1}...`);
      startServer(portToUse + 1);
    } else {
      console.error('[Server Fatal Error]', err);
      process.exit(1);
    }
  });

  // Graceful Shutdown for process managers (PM2 / Docker / Kubernetes)
  const handleGracefulShutdown = (signal) => {
    console.log(`\n[Server] Received ${signal}. Shutting down gracefully...`);
    serverInstance.close(async () => {
      try {
        const mongoose = require('mongoose');
        if (mongoose.connection.readyState !== 0) {
          await mongoose.connection.close();
          console.log('[Server] MongoDB connection closed.');
        }
      } catch (dbErr) {
        console.warn('[Server] Error closing MongoDB connection:', dbErr.message);
      }
      console.log('[Server] Process exited cleanly.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => handleGracefulShutdown('SIGINT'));
}

startServer(initialPort);
