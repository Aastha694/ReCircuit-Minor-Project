import { clerkMiddleware, requireAuth } from '@clerk/express';

// Initialize Clerk middleware — attach to app-level or use per-route
export const clerkAuth = clerkMiddleware();

// Protect individual routes — returns 401 if not authenticated
export const protectRoute = requireAuth();
