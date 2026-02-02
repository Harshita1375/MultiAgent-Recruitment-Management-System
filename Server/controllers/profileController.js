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

// Server/controllers/profileController.js

// Edit an entry (Update inside array)
exports.editItem = async (req, res) => {
    const { collection, itemId } = req.params; // e.g., collection = 'experience'
    try {
        const profile = await Profile.findOneAndUpdate(
            { user: req.user.id, [`${collection}._id`]: itemId },
            { $set: { [`${collection}.$`]: req.body } },
            { new: true }
        );
        res.json(profile);
    } catch (err) { res.status(500).json({ message: "Update failed" }); }
};

// Delete an entry (Remove from array)
exports.deleteItem = async (req, res) => {
    const { collection, itemId } = req.params;
    try {
        const profile = await Profile.findOneAndUpdate(
            { user: req.user.id },
            { $pull: { [collection]: { _id: itemId } } },
            { new: true }
        );
        res.json(profile);
    } catch (err) { res.status(500).json({ message: "Delete failed" }); }
};
// Server/controllers/profileController.js

// Ensure every function you reference in routes is exported here
exports.uploadAvatar = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "No file uploaded" });
        
        const profile = await Profile.findOneAndUpdate(
            { user: req.user.id },
            { $set: { profilePicture: `/uploads/${req.file.filename}` } },
            { new: true, upsert: true }
        );
        res.json(profile);
    } catch (err) {
        res.status(500).json({ message: "Upload failed" });
    }
};

exports.uploadCover = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "No file uploaded" });

        const profile = await Profile.findOneAndUpdate(
            { user: req.user.id },
            { $set: { coverPhoto: `/uploads/${req.file.filename}` } },
            { new: true, upsert: true }
        );
        res.json(profile);
    } catch (err) {
        res.status(500).json({ message: "Upload failed" });
    }
};