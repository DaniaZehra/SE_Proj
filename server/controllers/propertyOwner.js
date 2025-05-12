import Owner from '../DBmodels/propertyOwnerModel.js';
import {Property} from '../DBmodels/ServicesOfferedModel.js'; 
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const registerOwner = async (req, res) => {
    const { firstname, lastname, email, password, companyName, phone } = req.body;
    let emptyFields = [];
    if (!firstname) emptyFields.push('firstname');
    if (!lastname) emptyFields.push('lastname');
    if (!email) emptyFields.push('email');
    if (!password) emptyFields.push('password');

    if (emptyFields.length > 0) {
        return res.status(400).json({ error: 'Please fill in all required fields.', emptyFields });
    }
    if (password.length < 8) {
        return res.status(400).json({ error: 'Password should be at least 8 characters long.' });
    }

    const hasNumber = /\d/;
    if (!hasNumber.test(password)) {
        return res.status(400).json({ error: 'Password should contain at least one number.' });
    }

    try {
        const existingOwner = await Owner.findOne({ email });
        if (existingOwner) {
            return res.status(400).json({ error: 'Email already registered.' });
        }
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        const owner = await Owner.create({ firstname, lastname, email, password: hash, companyName, phone });
        res.status(201).json({
            firstname: owner.firstname,
            lastname: owner.lastname,
            email: owner.email,
            companyName: owner.companyName,
            phone: owner.phone
        });
    } catch (error) {
        console.error('Error registering owner:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};
//Login
const loginOwner = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Please provide email and password.' });
    }

    try {
        const owner = await Owner.findOne({ email });
        if (!owner) {
            return res.status(400).json({ error: 'Invalid credentials.' });
        }
        const match = await bcrypt.compare(password, owner.password);
        if (!match) {
            return res.status(400).json({ error: 'Invalid credentials.' });
        }
        const token = createToken(owner._id);
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'development',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 
        });
        res.status(200).json({
            message: 'Login successful.',
            owner: {
                _id: owner._id,
                firstname: owner.firstname,
                lastname: owner.lastname,
                email: owner.email,
                companyName: owner.companyName,
                phone: owner.phone
            },
            token
        });
    } catch (error) {
        console.error('Error logging in owner:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
const updateProperty = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const property = await Property.findById(id);
        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }

        // Check if the user owns this property
        if (property.ownerId.toString() !== req.userId) {
            return res.status(403).json({ error: 'Not authorized to update this property' });
        }

        const updatedProperty = await Property.findByIdAndUpdate(
            id,
            { 
                $set: {
                    ...updates,
                    updatedAt: new Date()
                }
            },
            { new: true, runValidators: true }
        );

        res.status(200).json(updatedProperty);
    } catch (error) {
        console.error('Error updating property:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getPropertyById = async(req, res) => {
    const { id } = req.params;
    try {
        const property = await Property.findById(id);
        
        if (!property) {
            return res.status(404).json({ error: "Property not found" });
        }

        res.status(200).json(property);
    } catch(error) {
        console.error('Error fetching property:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getPropertiesByOwnerId = async (req, res) => {
    const { id } = req.params;
    try {
        // Verify that the requesting user is the owner
        if (id !== req.userId) {
            return res.status(403).json({ error: 'Not authorized to view these properties' });
        }

        const properties = await Property.find({ ownerId: id });
        res.status(200).json(properties);
    } catch (error) {
        console.error('Error fetching owner properties:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const deleteProperty = async (req, res) => {
    const { id } = req.params;
    try {
        const property = await Property.findById(id);
        
        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }

        // Check if the user owns this property
        if (property.ownerId.toString() !== req.userId) {
            return res.status(403).json({ error: 'Not authorized to delete this property' });
        }

        await Property.findByIdAndDelete(id);
        res.status(200).json({ message: 'Property deleted successfully' });
    } catch (error) {
        console.error('Error deleting property:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const createProperty = async (req, res) => {
    try {
        const {
            name,
            description,
            location,
            propertyType,
            pricePerNight,
            amenities,
            images,
            filters
        } = req.body;

        // Get the ownerId from the authenticated user
        const ownerId = req.userId;

        const property = await Property.create({
            ownerId,
            name,
            description,
            location,
            propertyType,
            pricePerNight,
            amenities: amenities || [],
            images: images || [],
            filters: filters || {
                space: '',
                specialNeeds: []
            },
            availability: [], // Initialize with empty availability
            ratings: [], // Initialize with empty ratings
            createdAt: new Date(),
            updatedAt: new Date()
        });

        res.status(201).json({
            message: 'Property created successfully',
            property
        });
    } catch (error) {
        console.error('Error creating property:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getProfile = async (req, res) => {
    try {
        const owner = await Owner.findById(req.userId).select('-password');
        if (!owner) {
            return res.status(404).json({ error: 'Owner not found' });
        }
        res.status(200).json(owner);
    } catch (error) {
        console.error('Error fetching owner profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export { registerOwner, loginOwner, updateProperty, getPropertyById, getPropertiesByOwnerId, deleteProperty, createProperty, getProfile };
