import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const customerSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String
    }
}, { timestamps: true });
const Customer = mongoose.model('Customer', customerSchema);
export default Customer;
