import express from 'express';
import { loginUser, setupSuperAdmin } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', loginUser);
router.post('/setup', setupSuperAdmin); // Initial seed route

export default router;
