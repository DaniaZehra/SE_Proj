import Customer from '../DBmodels/customerModel.js';
import { propertyBooking } from '../DBmodels/bookingModel.js';
import { Property } from '../DBmodels/ServicesOfferedModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
  

export { registerCustomer, loginCustomer, booking, search };
