require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
// 1. Import your profile routes here
const profileRoutes = require('./routes/profileRoutes'); 

const app = express();
app.use(cors({
    origin: ["http://localhost:3000", "https://multi-agent-recruitment-management-system-n3vc-exyuqwhgd.vercel.app"],
    credentials: true
}));

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Database Connected"))
    .catch(err => console.log(err));

// Use the Routes
app.use('/api/auth', authRoutes);
// 2. Mount the profile routes so /api/profile/education becomes valid
app.use('/api/profile', profileRoutes); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));