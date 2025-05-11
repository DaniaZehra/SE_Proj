//this is just temporary, i have created these only to confirm operations on db
import express from 'express';
import { 
    loginAdmin,
    registerAdmin,
    getUser,
    updateUser,
    deleteUser
} from '../controllers/admin.js';
import cookieParser from 'cookie-parser';
import {getAllUsers} from '../controllers/admin.js';
import requireAuth from '../middleware.js';
import { 
    getPendingBookings,
    updateBookingStatus,
    getPendingActivityBookings,
    updateActivityBookingStatus,
    createProperty 
} from '../controllers/adminController.js';
import { verifyToken, isAdmin } from '../middleware.js';

const router = express.Router();
router.use(cookieParser());

router.post('/login', loginAdmin);
router.post('/register', registerAdmin);
router.get('/users', requireAuth, getAllUsers);
router.get('/users/:id', requireAuth, getUser);
router.patch('/users/:id', requireAuth, updateUser);
router.delete('/users/:id', requireAuth, deleteUser);

// Property management routes
router.post('/properties', verifyToken, isAdmin, createProperty);

// Booking management routes
router.get('/bookings/pending', verifyToken, isAdmin, getPendingBookings);
router.patch('/bookings/:bookingId/status', verifyToken, isAdmin, updateBookingStatus);

// Activity booking management routes
router.get('/activities/pending', verifyToken, isAdmin, getPendingActivityBookings);
router.patch('/activities/:bookingId/status', verifyToken, isAdmin, updateActivityBookingStatus);

export default router;
