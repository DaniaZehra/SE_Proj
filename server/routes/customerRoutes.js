//this is just temporary, i have created these only to confirm operations on db
import express from 'express';
import { registerCustomer, loginCustomer, booking, search, listActivity, editActivity, bookActivity, fetchActivities } from '../controllers/customer.js';
import {fetchById} from '../controllers/propertyFunctions.js'

const router = express.Router();
router.post('/register', registerCustomer);
router.post('/login', loginCustomer);
router.post('/book', booking)
router.get('/search', search)
router.get('/property/:id',fetchById)
router.post('/activity', listActivity)
router.patch('/activity/:id',editActivity)
router.post('/bookActivity', bookActivity)
router.get('/getActivities', fetchActivities)

export default router;
