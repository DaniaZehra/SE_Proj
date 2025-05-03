import Owner from '../DBmodels/propertyOwnerModel.js';
import Property from '../DBmodels/propertyModel.js'; 
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

//Add Property Listing

const CreateProperty = async(req, res) => {
    const {ownerId, name, description, location, pricePerNight} = req.body;
    try{
        const property = await Property.create({ownerId, name, description, location, pricePerNight})
        res.status(200).json({
            name: property.name,
            description: property.description,
            location: property.location,
            pricePerNight: property.pricePerNight
        });  
    }catch(err){
        res.status(400).json({error:err.message})
    }
}

export { registerOwner, loginOwner, CreateProperty };
