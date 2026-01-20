const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    // Remove 'required: true' from password and googleId
    password: { type: String }, 
    googleId: { type: String, unique: true, sparse: true }, // 'sparse' allows multiple null values
    picture: String,
    role: { 
        type: String, 
        enum: ['candidate', 'company', 'admin'], 
        required: true 
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);