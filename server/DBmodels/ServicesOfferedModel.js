import mongoose from 'mongoose'
const {Schema, model, Types} = mongoose

const propertySchema = new Schema({
    ownerId: Types.ObjectId,
    name: String,
    description: String,
    location: {
      city: String,
      country: String,
    },
    propertyType: {
      type: String,
      enum: ['Hotel', 'Rest House', 'Apartment', 'Hostel', 'Room', 'Home']
    },
    pricePerNight: Number,
    amenities: [String],
    availability: [
      {
        date: Date,
        isAvailable: Boolean
      }
    ],
    images: [String],
    filters: {
      space: String,
      specialNeeds: [String]
    },
    ratings: [Number],
    createdAt: Date,
    updatedAt: Date
});

const rideSchema = new Schema({
    driverId: { type: Types.ObjectId, ref: 'Driver', required: true },
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

const activitySchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        country: { type: String, required: true }
    },
    createdBy: {
        userId: { type: Types.ObjectId, ref: 'User', required: true },
        name: { type: String, required: true },
        contactNo: { type: String, required: true }
    },
    schedule: [
        {
            date: { type: Date, required: true },
            time: { type: String, required: true },
            slotsAvailable: { type: Number, required: true },
            maxSlots: { type: Number, required: true }
        }
    ],
    price: { type: Number, required: true },
    specialNeeds: [{ type: String }],
    images: [{ type: String }],
    ratings: {
        average: { type: Number, default: 0 },
        count: { type: Number, default: 0 }
    },
    reviews: [
        {
            userId: { type: Types.ObjectId, ref: 'User' },
            comment: String,
            rating: Number,
            date: { type: Date, default: Date.now }
        }
    ],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    isActive: {
        type: String,
        enum: ['pending request', 'request in review', 'request denied', 'Active'],
        default: 'pending request'
    }
});

// Check if models already exist before creating them
const Activity = mongoose.models.Activity || model('Activity', activitySchema);
const Property = mongoose.models.Property || model('Property', propertySchema);
const Ride = mongoose.models.Ride || model('Ride', rideSchema);

export { Property, Ride, Activity };


