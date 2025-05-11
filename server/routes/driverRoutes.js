//this is just temporary, i have created these only to confirm operations on db
import express from 'express';
import { registerDriver, loginDriver,addRide} from '../controllers/driver.js';

const router = express.Router();
router.post('/register', registerDriver);
router.post('/login', loginDriver);
router.post('/:driverId/addRide', addRide);
export default router;
