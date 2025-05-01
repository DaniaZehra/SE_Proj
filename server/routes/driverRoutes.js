//this is just temporary, i have created these only to confirm operations on db
import express from 'express';
import { registerDriver, loginDriver} from '../controllers/driver.js';

const router = express.Router();
router.post('/register', registerDriver);
router.post('/login', loginDriver);

export default router;
