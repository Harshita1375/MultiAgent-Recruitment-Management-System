const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bio: { type: String },
  location: { type: String },
  skills: [{ type: String }],
  experience: [{
    company: String,
    role: String,
    from: Date,
    to: Date,
    description: String
  }],
  education: [{
    school: String,
    degree: String,
    year: String
  }],
  social: {
    linkedin: String,
    github: String,
    portfolio: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Profile', ProfileSchema);