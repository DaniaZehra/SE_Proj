import mongoose from 'mongoose'
const {Schema, model, Types} = mongoose

const propertyBookingsSchema = new Schema({
    userId: Types.ObjectId,
    propertyId: Types.ObjectId,
    propertyName: String,
    roomType: String,
    guests: Number,
    checkIn: Date,
    checkOut: Date,
    price: Number,
    status: {type: String, enum: ['confirmed' | 'cancelled' | 'completed' | 'pending']},
    createdAt: Date,
    updatedAt: Date
})
const rideBookingSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    rideId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ride', required: true },
    bookingDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'pending'
    },
    fare: {
        type: Number,
        required: true
    }
});
const RideBooking = model('RideBooking', rideBookingSchema);
const propertyBooking = model('propertyBooking',propertyBookingsSchema)
export {propertyBooking, RideBooking}