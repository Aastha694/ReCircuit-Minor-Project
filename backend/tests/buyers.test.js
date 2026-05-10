import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import buyerRoutes from '../routes/buyers.js';
import Buyer from '../models/Buyer.js';

// Mock Clerk Middleware
jest.unstable_mockModule('../middlewares/auth.js', () => ({
  clerkAuth: (req, res, next) => next(),
  protectRoute: (req, res, next) => next(),
}));

const app = express();
app.use(express.json());
app.use('/api/buyers', buyerRoutes);

// Mock Mongoose Model
jest.unstable_mockModule('../models/Buyer.js', () => ({
  default: {
    find: jest.fn().mockReturnThis(),
    sort: jest.fn(),
  },
}));

describe('Buyer API Endpoints', () => {
  it('should return 400 if category is invalid', async () => {
    const res = await request(app).get('/api/buyers?category=invalid_cat');
    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toContain('Invalid category');
  });

  // Further tests would mock the DB response and verify success structure
});
