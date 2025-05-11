import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const driverSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    totalEarnings:{
        type: Number,
        default: 0
    }
}, { timestamps: true });

const Driver = mongoose.model('Driver', driverSchema);
export default Driver;

