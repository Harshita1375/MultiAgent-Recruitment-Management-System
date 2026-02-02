require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // Added for path handling
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes'); 

const app = express();

app.use(cors({
    origin: ["http://localhost:3000", "https://multi-agent-recruitment-management-system-n3vc-exyuqwhgd.vercel.app"],
    credentials: true
}));

app.use(express.json());

// Serve the uploads folder statically
// This allows http://localhost:5000/uploads/filename.jpg to be viewed
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Database Connected"))
    .catch(err => console.log(err));

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));