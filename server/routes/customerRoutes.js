//this is just temporary, i have created these only to confirm operations on db
import express from 'express';
import { registerCustomer, loginCustomer, booking, search } from '../controllers/customer.js';
import {fetchById} from '../controllers/propertyFunctions.js'

const router = express.Router();
router.post('/register', registerCustomer);
router.post('/login', loginCustomer);
router.post('/book', booking)
router.get('/search', search)
router.get('/property/:id',fetchById)

export default router;
