//this is just temporary, i have created these only to confirm operations on db
import express from 'express';
import {
    registerOwner,
    loginOwner,
    updateProperty,
    getPropertyById,
    getPropertiesByOwnerId,
    deleteProperty,
    createProperty,
    getProfile
} from '../controllers/propertyOwner.js';
import { verifyToken } from '../middleware.js';

const router = express.Router();

// Auth routes
router.post('/register', registerOwner);
router.post('/login', loginOwner);

// Profile route
router.get('/profile', verifyToken, getProfile);

// Property routes
router.post('/properties', verifyToken, createProperty);
router.get('/properties/:id', getPropertiesByOwnerId); 
router.put('/properties/:id', updateProperty);
router.delete('/properties/:id', deleteProperty);

export default router;
