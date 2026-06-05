import express from 'express';
import { createOrder, verifyPayment } from '../controllers/paymentController.js';

const router = express.Router();

// These routes are called by the mobile app, which might not have a full Auth Token at the exact moment 
// of checking out (if we allow guest checkout), but they require the CompanyID to know which Razorpay account to use.
// We'll keep them public for now, the controller validates the companyId.
router.post('/create-order', createOrder);
router.post('/verify', verifyPayment);

export default router;
