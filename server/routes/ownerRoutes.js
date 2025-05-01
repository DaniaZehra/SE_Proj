//this is just temporary, i have created these only to confirm operations on db
import express from 'express';
import { registerOwner, loginOwner } from '../controllers/propertyOwner.js';

const router = express.Router();
router.post('/register', registerOwner);
router.post('/login', loginOwner);

export default router;
