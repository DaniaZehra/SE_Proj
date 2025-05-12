import express from 'express';
import {
  searchFlights,
  bookFlight,
  cancelFlight,
} from '../controllers/flights.js';

const router = express.Router();

router.post('/search', searchFlights);
router.post('/book', bookFlight);
router.patch('/cancel/:bookingId', cancelFlight);

export default router;
