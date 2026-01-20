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
    const { token } = req.body;
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        const { sub, email, name, picture } = ticket.getPayload();

        // Check if user already exists in JobPortal database
        let user = await User.findOne({ email });

        if (!user) {
            // Do NOT save yet. Send data back to frontend to ask for role.
            return res.status(200).json({ 
                isNewUser: true, 
                googleData: { googleId: sub, email, name, picture } 
            });
        }

        // Existing user: Generate token and log in
        const sessionToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(200).json({ isNewUser: false, user, sessionToken });
    } catch (error) {
        res.status(401).json({ message: "Google Auth Failed" });
    }
};

// Ensure 'exports.' is at the start of the function
exports.finalizeRole = async (req, res) => {
    const { googleData, role } = req.body;
    try {
        const user = await User.create({ ...googleData, role });
        const sessionToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(201).json({ user, sessionToken });
    } catch (error) {
        console.error("Finalize Error:", error);
        res.status(500).json({ message: "Error saving role selection" });
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
        console.error(error);
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