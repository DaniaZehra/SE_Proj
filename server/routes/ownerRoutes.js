//this is just temporary, i have created these only to confirm operations on db
import express from 'express';
import { registerOwner, loginOwner, CreateProperty } from '../controllers/propertyOwner.js';

const router = express.Router();
router.post('/register', registerOwner);
router.post('/login', loginOwner);
router.post('/listProperty',CreateProperty)

export default router;
