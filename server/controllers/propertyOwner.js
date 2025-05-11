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
        res.status(400).json({ error: error.message });
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
            }
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
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

    const updatedProperty = await Property.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedProperty);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getPropertyById = async(req, res) => {
    const {id} = req.params;
    try {
        // Use findById instead of find for single documents
        const property = await Property.findById(id);
        
        if (!property) {
            return res.status(404).json({ error: "Property not found" });
        }

        console.log('Property data:', property); // Debug log
        
        // Return the property directly, not wrapped in {result: property}
        res.status(200).json(property);

    } catch(error) {
        console.error('Database error:', error);
        res.status(400).json({ 
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

const getPropertiesByOwnerId = async (req, res) => {
  const { id } = req.params;
  try {
    const properties = await Property.find({ ownerId: id });
    res.status(200).json(properties);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteProperty = async (req, res) => {
  const { id } = req.params;
  try {
    const property = await Property.findByIdAndDelete(id);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.status(200).json({ message: 'Property deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export { registerOwner, loginOwner, updateProperty, getPropertyById, getPropertiesByOwnerId, deleteProperty };
