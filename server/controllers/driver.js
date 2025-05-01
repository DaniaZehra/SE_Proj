import mongoose from 'mongoose';
import Driver from '../DBmodels/driverModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
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

        res.status(200).json({ message: 'Login successful.', driver });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export { registerDriver, loginDriver };
