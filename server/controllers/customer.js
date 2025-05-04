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
const booking = async(req, res)=>{
    type = req.params
    if(type == 'property'){
        const {userId, propertyId, roomType, guests, checkIn, checkOut, price, status} = req.body
        try{
            const booking = await propertyBooking.create({userId, propertyId, roomType, guests, checkIn, checkOut, price})
            res.status(200).json({
                propertyId: booking.propertyId,
                roomType: booking.roomType,
                guests: booking.guests,
                checkIn: booking.checkIn,
                checkOut: booking.checkOut
            })
        }catch(err){
            res.status(400).json({error: err.message})
        }
    }
    if(type == 'activity'){
        
    }
}

const search = async (req, res) => {
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
      res.status(200).json({ result });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
  

export { registerCustomer, loginCustomer, booking, search };
