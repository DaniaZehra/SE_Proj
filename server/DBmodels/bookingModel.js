import mongoose from 'mongoose'
const {Schema, model, Types} = mongoose

const propertyBookingsSchema = new Schema({
    userId: Types.ObjectId,
    propertyId: Types.ObjectId,
    propertyName: String,
    roomType: String,
    guests: {type: Number},
    checkIn: Date,
    checkOut: Date,
    price: {type: Number},
    status: {type: String, enum: ['confirmed', 'cancelled', 'completed', 'pending'], default: "pending"},
    createdAt: Date,
    updatedAt: Date
})

propertyBookingsSchema.post('save', async function(doc) {
  try {
    const update = {
      $set: {
        'propertyBookings.$[elem]': {
          bookingId: doc._id,
          name: doc.propertyName,
          forDate: doc.checkIn,
          status: doc.status,
          price: doc.price,
          updatedAt: new Date()
        }
      }
    };

    // First try to update if array exists
    const result = await mongoose.model('Customer').updateOne(
      { _id: doc.userId, propertyBookings: { $exists: true } },
      update,
      { arrayFilters: [{ 'elem.bookingId': doc._id }] }
    );

    // If no matches, initialize the array
    if (result.matchedCount === 0) {
      await mongoose.model('Customer').updateOne(
        { _id: doc.userId },
        {
          $setOnInsert: { /* other fields if needed */ },
          $push: { 
            propertyBookings: {
              bookingId: doc._id,
              name: doc.propertyName,
              forDate: doc.checkIn,
              status: doc.status,
              price: doc.price,
              updatedAt: new Date()
            }
          }
        },
        { upsert: true }
      );
    }
  } catch (error) {
    console.error('Sync failed:', error);
  }
});

// Sync after a booking is deleted
propertyBookingsSchema.post('findOneAndDelete', async function(doc) {
  if (!doc) return;
  
  try {
    await mongoose.model('Customer').updateOne(
      { _id: doc.userId },
      { $pull: { propertyBookings: { bookingId: doc._id } } }
    );
  } catch (error) {
    console.error('Failed to remove booking from customer:', error);
  }
}); 

const activityBookingSchema = new Schema({
  userId: { type: Types.ObjectId, ref: "User", required: true },
  activityId: { type: Types.ObjectId, ref: "Activity", required: true },
  slotsBooked: { type: Number, required: true, min: 1 },
  bookingStatus: {
    type: String,
    enum: ["confirmed", "cancelled", "pending"],
    default: "confirmed"
  },
  totalPrice: {type: Number, required: true},
  loyaltyPointsEarned: { type: Number, default: 0 },
  schedule: { 
    date: { type: Date, required: true },
    time: { type: String, required: true }
  },
  createdAt: { type: Date, default: Date.now }
});

const rideBookingSchema = new Schema({
    customerId: { type: Types.ObjectId, ref: 'Customer', required: true },
    rideId: { type: Types.ObjectId, ref: 'Ride', required: true },
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

// Check if models already exist before creating them
const PropertyBooking = mongoose.models.propertyBooking || model('propertyBooking', propertyBookingsSchema);
const ActivityBooking = mongoose.models.activityBooking || model('activityBooking', activityBookingSchema);
const RideBooking = mongoose.models.RideBooking || model('RideBooking', rideBookingSchema);

export { PropertyBooking, ActivityBooking , RideBooking };
