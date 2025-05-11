import mongoose from 'mongoose'
const Schema = mongoose.Schema;
const adminSchema = new Schema({
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
    }
}, { timestamps: true });

adminSchema.statics = {
    async getAllUsers() {  
        return this.find({}).select('-password');
    },
    async getUserById(userId) { 
        return this.findById(userId).select('-password'); 
    },
    async updateUser(userId, updateData) {
        return this.findByIdAndUpdate(
            userId, updateData, {new: true}
        ).select('-password');
    },
    async deleteUser(userId) {
        return this.findByIdAndDelete(userId);
    }
};
const Admin = mongoose.model('Admin', adminSchema);
export default Admin;