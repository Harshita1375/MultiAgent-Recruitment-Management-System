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
        
        req.files.forEach(file => {
            formData.append('resumes', file.buffer, file.originalname);
        });

        
        const nlpServiceUrl = process.env.NLP_SERVICE_URL || 'https://nlp-service-job-portal.onrender.com';

        // Forward to the dynamic NLP Service endpoint
        const nlpResponse = await axios.post(`${nlpServiceUrl}/api/ats/rank`, formData, {
            headers: { 
                ...formData.getHeaders() 
            },
            maxContentLength: Infinity,
            maxBodyLength: Infinity
        });

        res.json(nlpResponse.data);
    } catch (err) {
        // Detailed error logging to help debug connection issues between services
        console.error("ATS Service Error:", err.response?.data || err.message);
        
        const statusCode = err.response?.status || 500;
        const errorMessage = err.response?.data?.message || "ATS scoring service failed. Check if NLP service is running.";
        
        res.status(statusCode).json({ message: errorMessage });
    }
};