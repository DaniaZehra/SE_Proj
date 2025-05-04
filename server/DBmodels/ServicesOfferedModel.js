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
const Property = mongoose.model('Property', propertySchema)

export {Property}


