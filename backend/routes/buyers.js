import express from 'express';
import { clerkAuth, protectRoute } from '../middlewares/auth.js';
import { getBuyersByCategory } from '../controllers/buyerController.js';

const router = express.Router();

// GET /api/buyers?category=mobile_device
router.get('/', clerkAuth, protectRoute, getBuyersByCategory);

export default router;
