import Customer from '../DBmodels/customerModel.js';
import Driver from '../DBmodels/driverModel.js';
import { propertyBooking, RideBooking} from '../DBmodels/bookingModel.js';
import { Property,Ride } from '../DBmodels/ServicesOfferedModel.js';
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
//searching rides
const searchRides = async (req, res) => {
    const { pickupLocation, dropoffLocation } = req.body;

    try {
        if (!pickupLocation || !dropoffLocation) {
            return res.status(400).json({ message: 'Pickup and dropoff locations are required.' });
        }
        const rides = await Ride.find({
            pickupLocation,
            dropoffLocation,
            status: 'available'
        });

        if (rides.length === 0) {
            return res.status(404).json({ message: 'No available rides found going on this route.' });
        }
        res.status(200).json({ rides });
    } catch (error) {
        console.error('Error searching for rides:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
const bookRide = async (req, res) => {
    const { customerId } = req.params;
    const { rideId } = req.body;

    try {
        if (!rideId) {
            return res.status(400).json({ message: 'Ride ID is required.' });
        }

        const ride = await Ride.findById(rideId);
        if (!ride || ride.status !== 'available') {
            return res.status(404).json({ message: 'Ride not available or does not exist.' });
        }

        ride.status = 'booked';
        await ride.save();

        const booking = new RideBooking({
            customerId,
            rideId,
            status: 'pending',
            fare: ride.fare
        });

        await booking.save();

        res.status(201).json({
            message: 'Ride booked successfully',
            booking
        });
    } catch (error) {
        console.error('Error booking ride:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
const cancelRide = async (req, res) => {
  const { customerId, rideId } = req.params;

  try {
    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }
    const booking = await RideBooking.findOne({ customerId, rideId });
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found for this ride and customer' });
    }
    if (booking.status === 'completed') {
      return res.status(400).json({ message: 'Cannot cancel a completed booking' });
    }
    ride.status = 'available';
    await ride.save();

    booking.status = 'cancelled';
    await booking.save();

    res.status(200).json({ message: 'Ride cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling ride:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
//manual payment option (no gateway because not available here for free)
const processPayment = async (req, res) => {
  const { customerId, rideId } = req.params;

  try {
    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    if (ride.status !== 'booked') {
      return res.status(400).json({ message: 'Ride is not currently booked' });
    }

    const booking = await RideBooking.findOne({ customerId, rideId });
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    ride.status = 'available';
    ride.rideDate = new Date();
    await ride.save();

    booking.status = 'completed';
    await booking.save();
    const driver = await Driver.findById(ride.driverId);
    if (driver) {
      driver.totalEarnings += ride.fare;
      await driver.save();
    }

    res.status(200).json({ message: 'Payment successful, ride completed.', fare: ride.fare });

  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
export { registerCustomer, loginCustomer, booking, search, searchRides,bookRide, cancelRide, processPayment };
