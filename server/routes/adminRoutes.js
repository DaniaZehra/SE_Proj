//this is just temporary, i have created these only to confirm operations on db
import express from 'express';
import { 
    loginAdmin,
    registerAdmin,
    getUser,
    updateUser,
    deleteUser,
    createFlight,
    getAllFlights,
    deleteFlight
} from '../controllers/admin.js';
import cookieParser from 'cookie-parser';
import {getAllUsers} from '../controllers/admin.js';
import requireAuth from '../middleware.js';

const router = express.Router();
router.use(cookieParser());

router.post('/login', loginAdmin);
router.post('/register',registerAdmin);
router.get('/users', requireAuth, getAllUsers);
router.get('/users/:id', requireAuth, getUser);
router.patch('/users/:id', requireAuth, updateUser);
router.delete('/users/:id', requireAuth, deleteUser);

router.post('/flight', createFlight);
router.get('/flights', getAllFlights);
router.delete('/flight/:id', deleteFlight);
export default router;
