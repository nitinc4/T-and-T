import express from 'express';
import { getCompanies, createCompany, updateCompany, updateAppConfig } from '../controllers/companyController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

// All company routes are protected and restricted to SuperAdmin
router.route('/')
  .get(protect, restrictTo('SuperAdmin'), getCompanies)
  .post(protect, restrictTo('SuperAdmin'), createCompany);

router.route('/:id')
  .put(protect, restrictTo('SuperAdmin'), updateCompany);

// Allow CompanyAdmin and SuperAdmin to update app config
router.route('/:id/config')
  .put(protect, restrictTo('SuperAdmin', 'CompanyAdmin'), updateAppConfig);

export default router;
