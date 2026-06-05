import express from 'express';
import { getCustomers, getCustomerById, createCustomer, updateCustomer, deleteCustomer } from '../controllers/customerController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, restrictTo('CompanyAdmin'), getCustomers)
  .post(protect, restrictTo('CompanyAdmin'), createCustomer);

router.route('/:id')
  .get(protect, restrictTo('CompanyAdmin'), getCustomerById)
  .put(protect, restrictTo('CompanyAdmin'), updateCustomer)
  .delete(protect, restrictTo('CompanyAdmin'), deleteCustomer);

export default router;
