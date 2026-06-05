import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import authRoutes from './routes/authRoutes.js';
import companyRoutes from './routes/companyRoutes.js';
import vehicleRoutes from './routes/vehicleRoutes.js';
import driverRoutes from './routes/driverRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';

import helmet from 'helmet';
import rateLimit from 'express-rate-limit';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 1. CORS
app.use(cors());

// 2. Body Parser
app.use(express.json());

// 3. Security Middleware
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api', limiter);

// Basic health route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'TravelPro Server is running!' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/bookings', bookingRoutes);

// Database connection
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
    console.log('Ensure you provide a valid MONGODB_URI in the .env file');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT} (Database connection pending)`);
    });
  });
