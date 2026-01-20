const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    googleId: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    name: String,
    picture: String,
    role: { type: String, enum: ['candidate', 'company', 'admin'], default: 'candidate' }
});

module.exports = mongoose.model('User', userSchema);