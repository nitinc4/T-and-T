import express from 'express';
import { getDrivers, addDriver, updateDriverStatus } from '../controllers/driverController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, restrictTo('CompanyAdmin'), getDrivers)
  .post(protect, restrictTo('CompanyAdmin'), addDriver);

router.put('/me/status', protect, restrictTo('Driver'), updateDriverStatus);

export default router;
