import express from 'express';
import { getBookings, createBooking, assignResources } from '../controllers/bookingController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, restrictTo('CompanyAdmin'), getBookings)
  .post(protect, restrictTo('CompanyAdmin'), createBooking);

router.route('/:id/assign')
  .put(protect, restrictTo('CompanyAdmin'), assignResources);

export default router;
