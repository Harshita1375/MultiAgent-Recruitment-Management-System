const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // For password security
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Helper to generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// --- Google Auth ---
exports.googleAuth = async (req, res) => {
    const { token, role } = req.body; 
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        const { sub, email, name, picture } = ticket.getPayload();

        // Use findOneAndUpdate to save profile to the 'users' collection
        let user = await User.findOneAndUpdate(
            { email },
            { googleId: sub, name, picture, role }, 
            { new: true, upsert: true }
        );

        res.status(200).json({ user, sessionToken: generateToken(user._id) });
    } catch (error) {
        res.status(401).json({ message: "Google Auth Failed" });
    }
};

// --- Manual Register ---
exports.register = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "User already exists" });

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role // Ensures 'candidate', 'company', or 'admin' is saved
        });

        res.status(201).json({ user, sessionToken: generateToken(user._id) });
    } catch (error) {
        res.status(500).json({ message: "Server Error during registration" });
    }
};

// --- Manual Login ---
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        // Compare hashed password with entered password
        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({ user, sessionToken: generateToken(user._id) });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server Error during login" });
    }
};