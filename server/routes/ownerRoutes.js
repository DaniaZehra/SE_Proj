//this is just temporary, i have created these only to confirm operations on db
import express from 'express';
import {registerOwner, loginOwner, updateProperty, getPropertyById, getPropertiesByOwnerId, deleteProperty} from '../controllers/propertyOwner.js';

const router = express.Router();
router.post('/register', registerOwner);
router.post('/login', loginOwner);
router.get('/properties/:id', getPropertiesByOwnerId); 
router.put('/properties/:id', updateProperty);
router.delete('/properties/:id', deleteProperty);

export default router;
