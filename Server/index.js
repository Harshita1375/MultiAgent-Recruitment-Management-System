require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); 
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes'); 
const atsRoutes = require('./routes/atsRoutes'); // 1. Import the new ATS routes

const app = express();

app.use(cors({
    origin: ["http://localhost:3000", "https://multi-agent-recruitment-management-tau.vercel.app", "https://multi-agent-recruitment-management.vercel.app"],
    credentials: true
}));

app.use(express.json());


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
    res.status(200).send("🚀 Multi-Agent Recruitment Backend is Running!");
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Database Connected"))
    .catch(err => console.log(err));

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes); 
app.use('/api/ats', atsRoutes); // 2. Register the ATS base route

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));