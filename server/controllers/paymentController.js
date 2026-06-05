import Razorpay from 'razorpay';
import crypto from 'crypto';
import Company from '../models/Company.js';
import { createBookingModel } from '../models/Booking.js';

// @desc    Create Razorpay Order
// @route   POST /api/payments/create-order
// @access  Public (Called by customer app)
export const createOrder = async (req, res) => {
  try {
    const { companyId, amount, currency = 'INR', receipt } = req.body;

    const company = await Company.findById(companyId);
    if (!company || !company.razorpayKeyId || !company.razorpayKeySecret) {
      return res.status(400).json({ message: 'Payment gateway not configured for this provider.' });
    }

    const instance = new Razorpay({
      key_id: company.razorpayKeyId,
      key_secret: company.razorpayKeySecret,
    });

    const options = {
      amount: Math.round(amount * 100), // amount in smallest currency unit (paise)
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
    };

    const order = await instance.orders.create(options);

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: company.razorpayKeyId // Pass public key back to client
    });
  } catch (error) {
    console.error('Create Order Error:', error);
    res.status(500).json({ message: 'Unable to create payment order' });
  }
};

// @desc    Verify Razorpay Payment
// @route   POST /api/payments/verify
// @access  Public
export const verifyPayment = async (req, res) => {
  try {
    const { companyId, razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac('sha256', company.razorpayKeySecret)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Update booking status in the tenant DB
      const tenantDb = req.tenantDb; // Attached by some middleware or we construct it.
      // Wait, this route is public, so req.tenantDb isn't populated by protect authMiddleware. 
      // We need to fetch the connection manually since it's a public webhook-style endpoint.
      const { getTenantConnection } = await import('../utils/tenantConnection.js');
      const conn = await getTenantConnection(companyId);
      const Booking = createBookingModel(conn);
      
      const booking = await Booking.findById(bookingId);
      if (booking) {
        booking.paymentStatus = 'Completed';
        booking.paymentId = razorpay_payment_id;
        await booking.save();
      }

      res.json({ success: true, message: 'Payment verified successfully' });
    } else {
      res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }
  } catch (error) {
    console.error('Verify Payment Error:', error);
    res.status(500).json({ message: 'Server error during payment verification' });
  }
};
