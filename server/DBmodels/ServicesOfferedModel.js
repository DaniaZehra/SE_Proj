import mongoose from 'mongoose'
const { Schema, model, Types } = mongoose

const propertySchema = new Schema(
  {
    ownerId: Types.ObjectId,
    name: String,
    description: String,
    location: {
      city: String,
      country: String,
    },
    propertyType: { type: String, enum: ['Hotel', 'Rest House', 'Apartment', 'Hostel', 'Room', 'Home'] },
    pricePerNight: Number,
    amenities: [String],
    availability: [
      {
        date: Date,
        isAvailable: Boolean
      }
    ],
    status: {
      type: String,
      enum: ['pending', 'approved', 'cancelled'],
      default: 'pending',
    },
    images: [String],
    filters: {
      space: String,
      specialNeeds: [String]
    },
    ratings: [Number],
    createdAt: Date,
    updatedAt: Date
  }
)
const Property = mongoose.model('Property', propertySchema)

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

  price: {type: Number, required: true },

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

const Activity = model('Activity',activitySchema)

export {Property, Activity}


