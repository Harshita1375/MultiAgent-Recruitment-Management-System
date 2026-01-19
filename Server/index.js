const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.post('/api/auth/google', async (req, res) => {
    const { token } = req.body;
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        const { sub, email, name, picture } = ticket.getPayload();

        let user = await User.findOne({ googleId: sub });
        if (!user) {
            user = await User.create({ googleId: sub, email, name, picture });
        }

        const sessionToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ user, token: sessionToken });
    } catch (error) {
        res.status(401).json({ message: "Invalid Google Token" });
    }
});