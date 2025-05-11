import mongoose from 'mongoose'
const {Schema, model, Types} = mongoose

const propertySchema = new Schema(
{
    ownerId: Types.ObjectId,
    name: String,
    description: String,
    location: {
      city: String,
      country: String,
    },
    propertyType:{type:String, enum:['Hotel'|'Rest House'|'Apartment'|'Hostel'|'Room'|'Home']},
    pricePerNight: Number,
    amenities: [String],
    availability: [
      {
        date: Date,
        isAvailable: Boolean
      }
    ],
    // images: [String],
    // filters: {
    //   space: String,
    //   specialNeeds: [String]
    // },
    // ratings: [Number],
    createdAt: Date,
    updatedAt: Date
  }
)
const rideSchema = new Schema({
    driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: true },
    pickupLocation: {
        type: String,
        required: true
    },
    dropoffLocation: {
        type: String,
        required: true
    },
    rideDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['available', 'booked'],
        default: 'available'
    },
    fare: {
        type: Number,
        required: true
    }
});

const Ride = model('Ride', rideSchema);

const Property = mongoose.model('Property', propertySchema)

export {Property,Ride}


