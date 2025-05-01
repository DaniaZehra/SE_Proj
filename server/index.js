import dotenv from 'dotenv';
import express from 'express'
import mongoose from 'mongoose'
import adminRoutes from './routes/adminRoutes.js'
import customerRoutes from './routes/customerRoutes.js'
import ownerRoutes from './routes/ownerRoutes.js'
import driverRoutes from './routes/driverRoutes.js'
import cookieParser from 'cookie-parser';
const app = express();
dotenv.config();
const PORT = process.env.PORT;

app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});
app.use(cookieParser())
mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log('connected to db and listening on port',process.env.PORT)
    })
})
.catch((error)=>{
    console.log(error)
})
app.use(express.json());
app.use('/api/customer',customerRoutes)
app.use('/api/admin',adminRoutes)
app.use('/api/owner',ownerRoutes)
app.use('/api/driver',driverRoutes)