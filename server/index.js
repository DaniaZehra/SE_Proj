import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
const app = express();
import cors from 'cors';
dotenv.config();
const PORT = process.env.PORT || 4000;

app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});
app.use(cors({ origin: "http://localhost:3000" }));
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
.catch((error)=>{
    console.log(error)
})
app.use(express.json());
app.use('/api/customer',customerRoutes)
app.use('/api/admin',adminRoutes)
app.use('/api/owner',ownerRoutes)
app.use('/api/driver',driverRoutes)
