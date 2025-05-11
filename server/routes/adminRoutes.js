//this is just temporary, i have created these only to confirm operations on db
import express from 'express';
import { 
    registerAdmin, 
    loginAdmin,
    getUser,
    updateUser,
    deleteUser
} from '../controllers/admin.js';
import { getAllUsers } from '../controllers/admin.js';
import requireAuth from '../middleware.js';

const router = express.Router();
router.post('/register', registerAdmin);
router.post('/login', loginAdmin);

router.get('/users', requireAuth, getAllUsers);
router.get('/users/:id', requireAuth, getUser);
router.patch('/users/:id', requireAuth, updateUser);
router.delete('/users/:id', requireAuth, deleteUser);
export default router;
