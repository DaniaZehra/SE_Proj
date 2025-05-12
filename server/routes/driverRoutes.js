//this is just temporary, i have created these only to confirm operations on db
import express from 'express';
import { registerDriver, loginDriver, addRide, getRides, updateRide, deleteRide } from '../controllers/driver.js';

const router = express.Router();
router.post('/register', registerDriver);
router.post('/login', loginDriver);
router.post('/:driverId/addRide', addRide);
router.get('/:driverId/rides', getRides);
router.patch('/ride/:rideId', updateRide);
router.delete('/ride/:rideId', deleteRide);
export default router;
