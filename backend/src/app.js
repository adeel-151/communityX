const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middlewares/errorMiddleware');

const app = express();

// Security Middleware
app.use(helmet());
app.use(cors({
  origin: 'http://localhost:5173', // Vite default
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Body and Cookie parsers
app.use(express.json()); // Parse JSON bodies
app.use(cookieParser());

// Routes
const authRoutes = require('./routes/authRoutes');
const societyRoutes = require('./routes/societyRoutes');
const userRoutes = require('./routes/userRoutes');
const visitorRoutes = require('./routes/visitorRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const billRoutes = require('./routes/billRoutes');
const noticeRoutes = require('./routes/noticeRoutes');
const aiRoutes = require('./routes/aiRoutes');

// Base paths mapped to /api/v1
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/societies', societyRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/visitors', visitorRoutes);
app.use('/api/v1/complaints', complaintRoutes);
app.use('/api/v1/bills', billRoutes);
app.use('/api/v1/notices', noticeRoutes);
app.use('/api/v1/ai', aiRoutes);

// Base route
app.get('/', (req, res) => {
  res.send('CommunityX API v1 is running...');
});

// Centralized error handler
app.use(errorHandler);

module.exports = app;
