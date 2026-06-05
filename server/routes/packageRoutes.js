import express from 'express';
import { getPackages, createPackage, updatePackage, deletePackage } from '../controllers/packageController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(restrictTo('CompanyAdmin'));

router.route('/')
  .get(getPackages)
  .post(createPackage);

router.route('/:id')
  .put(updatePackage)
  .delete(deletePackage);

export default router;
