//this is just temporary, i have created these only to confirm operations on db
import express from 'express';
import { registerCustomer, loginCustomer, booking } from '../controllers/customer.js';

const router = express.Router();
router.post('/register', registerCustomer);
router.post('/login', loginCustomer);
router.post('/book', booking)

export default router;
