import express from 'express';
import { getBookings, createBooking, updateBookingStatus, assignResources, getDriverBookings } from '../controllers/bookingController.js';
import { generateInvoice } from '../controllers/invoiceController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, restrictTo('CompanyAdmin'), getBookings)
  .post(protect, restrictTo('CompanyAdmin'), createBooking);

router.get('/driver/me', protect, restrictTo('Driver'), getDriverBookings);

router.put('/:id/status', protect, updateBookingStatus);
router.put('/:id/assign', protect, restrictTo('CompanyAdmin'), assignResources);
router.get('/:id/invoice', generateInvoice);

export default router;
