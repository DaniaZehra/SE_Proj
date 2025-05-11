import Customer from '../DBmodels/customerModel.js';
import Driver from '../DBmodels/driverModel.js';
import { propertyBooking, RideBooking} from '../DBmodels/bookingModel.js';
import { Property,Ride } from '../DBmodels/ServicesOfferedModel.js';
import { propertyBooking } from '../DBmodels/bookingModel.js';
import { Activity } from '../DBmodels/ServicesOfferedModel.js';
import {activityBooking} from '../DBmodels/bookingModel.js'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import axios from 'axios';
//Registration
const registerCustomer = async (req, res) => {
    const { firstname, lastname, email, password, phone } = req.body;
    let emptyFields = [];
    if (!firstname) emptyFields.push('firstname');
    if (!lastname) emptyFields.push('lastname');
    if (!email) emptyFields.push('email');
    if (!password) emptyFields.push('password');
    
    if(password.length < 8 && !/\d/.test(password)){
        return res.status(400).json({
            error: 'Password must be atleast 8 characters long and should have atleast one number.'
        })
    }
    if (password.length < 8) {
        return res.status(400).json({ 
            error: 'Password must be at least 8 characters long.' 
        });
    }

    if (!/\d/.test(password)) {
        return res.status(400).json({ 
            error: 'Password must contain at least one number.' 
        });
    }
    if (emptyFields.length > 0) {
        return res.status(400).json({ error: 'Please fill in all required fields.', emptyFields });
    }

    try {
        const existingCustomer = await Customer.findOne({ email });
        if (existingCustomer) {
            return res.status(400).json({ error: 'Email already registered.' });
        }
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        const customer = await Customer.create({ firstname, lastname, email, password: hash, phone });
        res.status(201).json(customer);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};
//Login
const loginCustomer = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Please provide email and password.' });
    }

    try {
        const customer = await Customer.findOne({ email });
        if (!customer) {
            return res.status(400).json({ error: 'Invalid credentials.' });
        }
        const match = await bcrypt.compare(password, customer.password);
        if (!match) {
            return res.status(400).json({ error: 'Invalid credentials.' });
        }
        const token = createToken(customer._id);
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'development',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 
        });
        res.status(200).json({ message: 'Login successful.', customer: { ...customer._doc, password: undefined } });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

//Booking
const booking = async (req, res) => {
  const { userId, propertyId, propertyType, guests, checkIn, checkOut, price} = req.body;

  try {
    // Validate required fields
    if (!userId || !propertyId || !checkIn || !checkOut) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const currentDate = new Date();

    if (checkInDate >= checkOutDate) {
      return res.status(400).json({ error: "Check-out date must be after check-in date" });
    }

    if (checkInDate < currentDate) {
      return res.status(400).json({ error: "Check-in date cannot be in the past" });
    }

    const oneDay = 24 * 60 * 60 * 1000;
    if ((checkOutDate - checkInDate) < oneDay) {
      return res.status(400).json({ error: "Minimum stay is 1 night" });
    }

    // Guest validation
    if (!guests || guests < 1) {
      return res.status(400).json({ error: "At least 1 guest is required" });
    }

    if (!price || price <= 0) {
      return res.status(400).json({ error: "Invalid price" });
    }
    const booking = await propertyBooking.create({
      userId,
      propertyId,
      propertyType,
      guests,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      price,
      status: status || "pending"
    });

    res.status(200).json({
      bookingId: booking._id,
      propertyId: booking.propertyId,
      propertyType: booking.propertyType,
      guests: booking.guests,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      price: booking.price,
      status: booking.status
    });

  } catch (err) {
    console.error("Booking error:", err);
    res.status(400).json({ 
      error: err.message || "Failed to create booking",
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};

//Search function
const search = async (req, res) => {
  console.log(req.query.city)
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sortField = req.query.sortBy || 'pricePerNight';
  const sortOrder = req.query.order === 'desc' ? -1 : 1;

  try {
    const query = {};

    if (req.query.propertyType) {
      const types = Array.isArray(req.query.propertyType)
        ? req.query.propertyType
        : [req.query.propertyType];
      query.propertyType = { $in: types };
    }
    

    if (req.query.city) {
      query["location.city"] = req.query.city;
    }

    if (req.query.country) {
      query["location.country"] = req.query.country;
    }

    if (req.query.name) {
      query.name = { $regex: req.query.name, $options: "i" }; 
    }

    if (req.query.minPrice || req.query.maxPrice) {
      query.pricePerNight = {};
      if (req.query.minPrice) query.pricePerNight.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) query.pricePerNight.$lte = Number(req.query.maxPrice);
    }

    const result = await Property.find(query)
    .sort({ [sortField]: sortOrder })
    .skip((page - 1) * limit)
    .limit(limit);
    const total = await Property.countDocuments(query);
    console.log(total)
    res.status(200).json({
      properties: result,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalResults: total
  });
  }catch (err) {
    res.status(400).json({ error: err.message });
  }
};

  
//List Activity 

const listActivity = async(req, res)=>{
  const {title, description, location, schedule, price, specialNeeds, images, createdBy} = req.body
  if(!title || !description || !location.address || !location.city || !location.country || !createdBy.userId || !createdBy.name || !createdBy.contactNo){
    throw("Missing key fields please try again")
  }
  try{
    const activity = await Activity.create({
      title,
      description,
      createdBy,
      images: images || '/placeholder.jpg',
      schedule,
      price, 
      specialNeeds,
      location
    })

    res.status(200).json({
      title: activity.title,
      description:activity.description,
      createdBy: activity.createdBy,
      schedule: activity.schedule,
      price: activity.price,
      location: activity.location
    })
  }catch(error){
    res.status(400).json({ error: error.message });
  }

}

//Edit Activity

const editActivity = async (req, res) => {
  const activityId = req.params.id;
  const updates = req.body;

  if (!activityId) {
    return res.status(400).json({ error: "Activity ID is required" });
  }

  try {
    const activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).json({ error: "Activity not found" });
    }

    if (updates.title && typeof updates.title !== "string") {
      return res.status(400).json({ error: "Title must be a string" });
    }
    if (updates.price && typeof updates.price !== "number") {
      return res.status(400).json({ error: "Price must be a number" });
    }
    if (updates.location) {
      const { address, city, country } = updates.location;
      if (!address || !city || !country) {
        return res.status(400).json({ error: "Location must include address, city, and country" });
      }
    }

    const updatedActivity = await Activity.findByIdAndUpdate(
      activityId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Activity updated successfully",
      activity: updatedActivity
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const bookActivity = async (req, res) => {
  const { userId, activityId, slotsBooked, schedule } = req.body;
  console.log(userId, activityId)

  try {
    const activity = await Activity.findById(activityId);
    if (!activity) throw new Error('Activity not found');

    if (!schedule?.date || !schedule?.time) {
      return res.status(400).json({ 
        error: "Schedule must include date and time",
        example: {
          date: "2025-07-09T00:00:00.000Z",
          time: "09:00"
        }
      });
    }

    const scheduleDate = new Date(schedule.date);
    const scheduleItem = activity.schedule.find(s => {
      const activityDate = new Date(s.date);
      return (
        activityDate.getTime() === scheduleDate.getTime() &&
        s.time === schedule.time
      );
    });

    if (!scheduleItem) {
      return res.status(404).json({
        error: "Matching schedule not found",
        availableSchedules: activity.schedule.map(s => ({
          date: s.date,
          time: s.time,
          slotsAvailable: s.slotsAvailable
        }))
      });
    }

    // 4. Create booking
    const booking = await activityBooking.create({
      userId,
      activityId,
      slotsBooked,
      totalPrice: activity.price * slotsBooked,
      schedule: scheduleItem
    });

    res.status(201).json(booking);

  } catch (error) {
    res.status(500).json({
      error: error.message,
      receivedPayload: req.body  // Echo back for debugging
    });
  }
}

//GET ALL activities
const fetchActivities = async(req, res) => {
  try{
    const result = await Activity.find({isActive:'Active'})
    const total = await Activity.countDocuments({isActive: 'Active'})
    res.json({result: result, total:total})
  }catch(error){
    console.log(error)
    throw(error)
  }
  
}

export { registerCustomer, loginCustomer, booking, search, listActivity, editActivity, bookActivity, fetchActivities };
