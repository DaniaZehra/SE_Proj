import mongoose from 'mongoose';
import Driver from '../DBmodels/driverModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import axios from 'axios';
import { Ride } from '../DBmodels/ServicesOfferedModel.js';
dotenv.config();

// Register
const registerDriver = async (req, res) => {
    const { firstname, lastname, email, password, phone } = req.body;

    let emptyFields = [];
    if (!firstname) emptyFields.push('firstname');
    if (!lastname) emptyFields.push('lastname');
    if (!email) emptyFields.push('email');
    if (!password) emptyFields.push('password');

    if (emptyFields.length > 0) {
        return res.status(400).json({ error: 'Please fill in all required fields.', emptyFields });
    }

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
    try {
        const existingDriver = await Driver.findOne({ email });
        if (existingDriver) {
            return res.status(400).json({ error: 'Email already registered.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const driver = await Driver.create({ firstname, lastname, email, password: hash, phone });
        res.status(201).json(driver);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1d'
    });
};
// Logim
const loginDriver = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Please provide email and password.' });
    }

    try {
        const driver = await Driver.findOne({ email });

        if (!driver) {
            return res.status(400).json({ error: 'Invalid credentials.' });
        }

        const match = await bcrypt.compare(password, driver.password);

        if (!match) {
            return res.status(400).json({ error: 'Invalid credentials.' });
        }

        const token = createToken(driver._id);

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'development',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 
        });

        if (role === "driver" && driver && driver._id) {
            localStorage.setItem("driverId", driver._id);
        }

        res.status(200).json({ message: 'Login successful.', driver });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
//estimate fare
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const estimateFare = async (pickupLocation, dropoffLocation) => {
  try {
    if (!pickupLocation || !dropoffLocation) {
      throw new Error('Origin and destination are required');
    }

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(pickupLocation)}&destinations=${encodeURIComponent(dropoffLocation)}&key=${process.env.GOOGLE_API_KEY}`;
    const response = await axios.get(url);
    
    console.log('Google Maps API response:', response.data);

    if (
      response.data.status !== 'OK' ||
      !response.data.rows ||
      !response.data.rows[0] ||
      !response.data.rows[0].elements ||
      !response.data.rows[0].elements[0].distance
    ) {
      throw new Error('Unable to get distance from API');
    }

    const distanceInKm = response.data.rows[0].elements[0].distance.value / 1000;
    return distanceInKm * 55;  
  } catch (error) {
    throw new Error('Error estimating fare: ' + error.message);
  }
};

const addRide = async (req, res) => {
    const driverId = req.params.driverId;
    const {pickupLocation, dropoffLocation } = req.body;

    try {
        const fare = await estimateFare(pickupLocation, dropoffLocation);
        const newRide = new Ride({
            driverId,
            pickupLocation,
            dropoffLocation,
            rideDate : new Date(),
            fare,
            status: 'available'  
        });
        await newRide.save(); 

        res.status(201).json({ message: 'Ride added successfully', ride: newRide });
    } catch (error) {
        console.error('Error adding ride:', error);
        res.status(500).json({ message: `Error adding ride: ${error.message}` });
    }
};

// Get all rides for a driver
const getRides = async (req, res) => {
    const driverId = req.params.driverId;
    try {
        const rides = await Ride.find({ driverId });
        res.status(200).json(rides);
    } catch (error) {
        res.status(500).json({ message: `Error fetching rides: ${error.message}` });
    }
};

// Update a ride
const updateRide = async (req, res) => {
    const { rideId } = req.params;
    const updateData = req.body;
    try {
        const ride = await Ride.findByIdAndUpdate(rideId, updateData, { new: true });
        if (!ride) return res.status(404).json({ message: 'Ride not found' });
        res.status(200).json(ride);
    } catch (error) {
        res.status(500).json({ message: `Error updating ride: ${error.message}` });
    }
};

// Delete a ride
const deleteRide = async (req, res) => {
    const { rideId } = req.params;
    try {
        const ride = await Ride.findByIdAndDelete(rideId);
        if (!ride) return res.status(404).json({ message: 'Ride not found' });
        res.status(200).json({ message: 'Ride deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: `Error deleting ride: ${error.message}` });
    }
};

export { registerDriver, loginDriver, addRide, getRides, updateRide, deleteRide };
