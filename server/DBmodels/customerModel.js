import mongoose from 'mongoose'
const {Schema, model, Types} = mongoose;

const customerSchema = new Schema({
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
    propertyBookings: [
    { bookingId: Types.ObjectId, propertyName: String, forDate: Date, status: String }
    ],

    flightBookings: [
    { bookingId: Types.ObjectId, flightNumber: String, forDate: Date, status: String }
    ],

    activityBookings: [
    { bookingId: Types.ObjectId, activityName: String, forDate: Date, status: String }
    ],
    dealBookings: [
    { bookingId: Types.ObjectId, dealName: String, forDate: Date, status: String }
    ],
}, { timestamps: true });

const Customer = model('Customer', customerSchema);
export default Customer
