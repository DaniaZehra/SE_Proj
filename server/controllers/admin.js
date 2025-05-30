import mongoose from 'mongoose'
import Admin from '../DBmodels/adminModel.js';
import bcrypt from 'bcrypt' 
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Customer from '../DBmodels/customerModel.js';
import Driver from '../DBmodels/driverModel.js';
import Owner from '../DBmodels/propertyOwnerModel.js';
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
    return jwt.sign({ id, role: 'admin' }, process.env.JWT_SECRET, {
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
        const [admins, customers, drivers, owners] = await Promise.all([
            Admin.find({}).select('-password'),
            Customer.find({}).select('-password'),
            Driver.find({}).select('-password'),
            Owner.find({}).select('-password')
        ]);

        // Add role to each user
        const allUsers = [
            ...admins.map(admin => ({ ...admin.toObject(), role: 'admin' })),
            ...customers.map(customer => ({ ...customer.toObject(), role: 'customer' })),
            ...drivers.map(driver => ({ ...driver.toObject(), role: 'driver' })),
            ...owners.map(owner => ({ ...owner.toObject(), role: 'propertyOwner' }))
        ];

        res.status(200).json(allUsers);
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
    const { role, ...updateData } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Invalid user ID' });
    }

    try {
        let updatedUser;
        switch (role) {
            case 'admin':
                updatedUser = await Admin.findByIdAndUpdate(id, updateData, { new: true }).select('-password');
                break;
            case 'customer':
                updatedUser = await Customer.findByIdAndUpdate(id, updateData, { new: true }).select('-password');
                break;
            case 'driver':
                updatedUser = await Driver.findByIdAndUpdate(id, updateData, { new: true }).select('-password');
                break;
            case 'propertyOwner':
                updatedUser = await Owner.findByIdAndUpdate(id, updateData, { new: true }).select('-password');
                break;
            default:
                return res.status(400).json({ error: 'Invalid user role' });
        }

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Add role back to the response
        updatedUser = { ...updatedUser.toObject(), role };
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Invalid user ID' });
    }

    try {
        let deletedUser;
        switch (role) {
            case 'admin':
                deletedUser = await Admin.findByIdAndDelete(id);
                break;
            case 'customer':
                deletedUser = await Customer.findByIdAndDelete(id);
                break;
            case 'driver':
                deletedUser = await Driver.findByIdAndDelete(id);
                break;
            case 'propertyOwner':
                deletedUser = await Owner.findByIdAndDelete(id);
                break;
            default:
                return res.status(400).json({ error: 'Invalid user role' });
        }

        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export {registerAdmin, loginAdmin, getAllUsers, getUser, updateUser, deleteUser};
