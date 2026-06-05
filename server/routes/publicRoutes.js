import express from 'express';
import { getActiveCompanies, getCompanyConfig } from '../controllers/publicController.js';

const router = express.Router();

// Public routes for the mobile app before login
router.get('/companies', getActiveCompanies);
router.get('/companies/:id/config', getCompanyConfig);

export default router;
