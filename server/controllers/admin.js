import mongoose from 'mongoose'
import Admin from '../DBmodels/adminModel.js';
import bcrypt from 'bcrypt' 
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Flight } from '../DBmodels/flightModels.js';
dotenv.config();
//register
const registerAdmin = async (req, res) => {
    const { firstname, lastname, email, password } = req.body;

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
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ error: 'Email already registered.' });
        }
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        const admin = await Admin.create({ firstname,lastname, email, password: hash });
        res.status(201).json(admin);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
//helper for tokem
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1d' 
    });
};
//login
const loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Please provide email and password.' });
    }

    try {
        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(400).json({ error: 'Invalid credentials.' });
        }

        const match = await bcrypt.compare(password, admin.password);

        if (!match) {
            return res.status(400).json({ error: 'Invalid credentials.' });
        }
        const token = createToken(admin._id); 

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'development',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000
        });
        res.status(200).json({ message: 'Login successful.', admin });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

//user management functions

const getAllUsers = async (req, res) => {
    try {
        const users = await Admin.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getUser = async(req,res) => {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Invalid user ID' });
    }
    try {
        const user = await Admin.getUserById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } 
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateUser = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Invalid user ID' });
    }

    try {
        const user = await Admin.updateUser(id, req.body);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Invalid user ID' });
    }

    try {
        const user = await Admin.deleteUser(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// CREATE FLIGHT
const createFlight = async (req, res) => {
    const { airline, from, to, date, time, price, seatsAvailable } = req.body;  

    if (!airline || !from || !to || !date || !time || !price || !seatsAvailable) {
        return res.status(400).json({ error: "All fields are required." });
    }

    try {
        const flight = new Flight({
            airline,
            from,
            to,
            date,
            time, 
            price,
            seatsAvailable, 
            status: "scheduled" 
        });
        await flight.save();

        res.status(201).json({ message: 'Flight created successfully', flight });
    } catch (error) {
        res.status(500).json({ error: "Failed to create flight", details: error.message });
    }
};
// GET ALL FLIGHTS
const getAllFlights = async (req, res) => {
    try {
        const flights = await Flight.find({});
        res.status(200).json(flights);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch flights", details: error.message });
    }
};

// DELETE FLIGHT
const deleteFlight = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Invalid flight ID' });
    }

    try {
        const deleted = await Flight.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ error: 'Flight not found' });
        }
        res.status(200).json({ message: 'Flight deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete flight", details: error.message });
    }
};


export {registerAdmin, loginAdmin, getAllUsers, getUser, updateUser, deleteUser,createFlight,getAllFlights, deleteFlight};
