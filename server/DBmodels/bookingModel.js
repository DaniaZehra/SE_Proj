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


const propertyBooking = model('propertyBooking',propertyBookingsSchema)
export {propertyBooking}