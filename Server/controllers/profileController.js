const Profile = require('../models/Profile');

// Get current user's profile
exports.getProfile = async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });
        if (!profile) return res.status(404).json({ message: "Profile not found" });
        res.json(profile);
    } catch (err) {
        res.status(500).send("Server Error");
    }
};

// General profile update
exports.updateProfile = async (req, res) => {
    try {
        const profile = await Profile.findOneAndUpdate(
            { user: req.user.id },
            { $set: req.body },
            { new: true, upsert: true }
        );
        res.status(200).json(profile);
    } catch (err) {
        res.status(500).json({ message: "Error updating profile" });
    }
};

// Add Education using $push
exports.addEducation = async (req, res) => {
    try {
        const profile = await Profile.findOneAndUpdate(
            { user: req.user.id },
            { $push: { education: req.body } }, 
            { new: true, upsert: true }
        );
        res.status(200).json(profile);
    } catch (err) {
        res.status(500).json({ message: "Error adding education" });
    }
};

// Add Experience
exports.addExperience = async (req, res) => {
    try {
        const profile = await Profile.findOneAndUpdate(
            { user: req.user.id },
            { $push: { experience: req.body } },
            { new: true, upsert: true }
        );
        res.status(200).json(profile);
    } catch (err) {
        res.status(500).json({ message: "Error adding experience" });
    }
};

// Add Certification
exports.addCertification = async (req, res) => {
    try {
        const profile = await Profile.findOneAndUpdate(
            { user: req.user.id },
            { $push: { certifications: req.body } },
            { new: true, upsert: true }
        );
        res.status(200).json(profile);
    } catch (err) {
        res.status(500).json({ message: "Error adding certification" });
    }
};