import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import adminRoutes from './routes/adminRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import ownerRoutes from './routes/ownerRoutes.js';
import driverRoutes from './routes/driverRoutes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true, 
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
app.use(express.json());
app.use(cookieParser());
app.get('/', (req, res) => {
    res.send('Backend API is running');
});
app.use('/api/customer', customerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/owner', ownerRoutes);
app.use('/api/driver', driverRoutes);
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log(' Connected to db');
    app.listen(PORT, () => {
        console.log(`Server running on port`, process.env.PORT);
    });
})
.catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong' });
});