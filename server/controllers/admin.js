import mongoose from 'mongoose'
import Admin from '../DBmodels/adminModel.js';
import bcrypt from 'bcrypt' 
//register
const registerAdmin = async (req, res) => {
    const { firstname, lastname, email, password } = req.body;

    let emptyFields = [];
    if (!firstname) emptyFields.push('firstname');
    if (!lastname) emptyFields.push('lastname');
    if (!email) emptyFields.push('email');
    if (!password) emptyFields.push('password');

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

        res.status(200).json({ message: 'Login successful.', admin });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export {registerAdmin, loginAdmin}
