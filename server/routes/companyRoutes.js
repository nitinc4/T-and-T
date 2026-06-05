import express from 'express';
import { getCompanies, createCompany, updateCompany } from '../controllers/companyController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

// All company routes are protected and restricted to SuperAdmin
router.route('/')
  .get(protect, restrictTo('SuperAdmin'), getCompanies)
  .post(protect, restrictTo('SuperAdmin'), createCompany);

router.route('/:id')
  .put(protect, restrictTo('SuperAdmin'), updateCompany);

export default router;
