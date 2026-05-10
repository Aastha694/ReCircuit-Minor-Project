import express from 'express';
import { clerkAuth, protectRoute } from '../middlewares/auth.js';
import { updateSubmissionCategory } from '../controllers/submissionController.js';

const router = express.Router();

// PATCH /api/submissions/:id/category — override AI-predicted category
router.patch('/:id/category', clerkAuth, protectRoute, updateSubmissionCategory);

export default router;
