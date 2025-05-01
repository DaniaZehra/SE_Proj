import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const ownerSchema = new Schema({
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
    companyName: {
        type: String
    },
    phone: {
        type: String
    }
}, { timestamps: true });
const Owner = mongoose.model('Owner', ownerSchema);
export default Owner;