import mongoose from 'mongoose'
const {Schema, model, Types} = mongoose

const propertyBookingsSchema = new Schema({
    userId: Types.ObjectId,
    propertyId: Types.ObjectId,
    propertyName: String,
    roomType: String,
    guests: {type:Number},
    checkIn: Date,
    checkOut: Date,
    price: {type: Number},
    status: {type: String, enum: ['confirmed' | 'cancelled' | 'completed' | 'pending'], default: "pending"},
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

const propertyBooking = model('propertyBooking',propertyBookingsSchema)
export {propertyBooking}