const axios = require('axios');
const FormData = require('form-data');

exports.checkATS = async (req, res) => {
    try {
        const { jd } = req.body;
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "No resumes uploaded" });
        }

        const formData = new FormData();
        formData.append('jd', jd);
        
        // Append each file buffer to the new form
        req.files.forEach(file => {
            formData.append('resumes', file.buffer, file.originalname);
        });

        // Forward to your local NLP Service
        const nlpResponse = await axios.post('http://localhost:8000/api/ats/rank', formData, {
            headers: { ...formData.getHeaders() }
        });

        res.json(nlpResponse.data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "ATS scoring service failed" });
    }
};