import express from 'express';
import { createProperty } from '../controllers/propertyOwnerController.js';
import { verifyToken } from '../middleware.js';

const router = express.Router();

// Property management routes
router.post('/properties', verifyToken, createProperty);

export default router; 