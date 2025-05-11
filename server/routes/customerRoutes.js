//this is just temporary, i have created these only to confirm operations on db
import express from 'express';
import { registerCustomer, loginCustomer, booking, search, searchRides, bookRide, cancelRide, processPayment } from '../controllers/customer.js';
const router = express.Router();
router.post('/searchRides', searchRides);
router.post('/:customerId/bookRide', bookRide);
router.post('/:customerId/cancelRide/:rideId', cancelRide);
router.post('/:customerId/ride/:rideId/pay', processPayment);
router.post('/register', registerCustomer);
router.post('/login', loginCustomer);
router.post('/book', booking)
router.get('/search', search)

export default router;
