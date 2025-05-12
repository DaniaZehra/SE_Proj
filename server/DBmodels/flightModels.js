import mongoose from 'mongoose';
const { Schema, model, Types } = mongoose;

const flightSchema = new Schema({
  airline: { type: String, required: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  date: { type: Date, required: true },
  seatsAvailable: { type: Number, required: true },
  price: { type: Number, required: true },
  time: { type: String },  
  status: {
    type: String,
    enum: ['scheduled', 'cancelled', 'delayed'],
    default: 'scheduled'
  },
  createdAt: { type: Date, default: Date.now }
});

const Flight = model('Flight', flightSchema);

const flightBookerSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  contactNumber: { type: String, required: true }
});

const FlightBooker = model('FlightBooker', flightBookerSchema);

const flightBookingSchema = new Schema({
  flightId: { type: Types.ObjectId, ref: 'Flight', required: true },
  customerId: { type: Types.ObjectId, ref: 'User', required: true },
  bookerId: { type: Types.ObjectId, ref: 'FlightBooker', required: true },
  bookingDate: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['booked', 'cancelled'],
    default: 'booked'
  },
  rescheduledTo: { type: Types.ObjectId, ref: 'Flight', default: null }
}, { timestamps: true });

const FlightBooking = model('FlightBooking', flightBookingSchema);
export {FlightBooker, FlightBooking, Flight}
