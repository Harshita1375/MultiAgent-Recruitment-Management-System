const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bio: { type: String },
  location: { type: String },
  skills: [{ type: String }],
  experience: [{
    company: { type: String },
    role: { type: String },
    from: { type: Date }, // Expects Date object
    to: { type: Date },   // Expects Date object
    description: { type: String }
  }],
  education: [{
    school: { type: String },
    degree: { type: String },
    year: { type: String }
  }],
  certifications: [{ // Nested certification array
    name: { type: String, required: true },
    issuingOrganization: { type: String, required: true },
    issueDate: { type: Date },
    credentialUrl: { type: String }
  }],
  social: {
    linkedin: String,
    github: String,
    portfolio: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Profile', ProfileSchema);