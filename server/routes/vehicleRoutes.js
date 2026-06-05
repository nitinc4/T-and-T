import express from 'express';
import { getVehicles, addVehicle } from '../controllers/vehicleController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, restrictTo('CompanyAdmin'), getVehicles)
  .post(protect, restrictTo('CompanyAdmin'), addVehicle);

export default router;
