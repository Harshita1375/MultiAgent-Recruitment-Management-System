const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 1. Define Disk Storage (For Profile Pics and saved Resumes)
const diskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const folder = file.fieldname === 'resume' ? './uploads/resumes/' : './uploads/profiles/';
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, { recursive: true });
        }
        cb(null, folder);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${req.user?.id || 'user'}-${Date.now()}`;
        cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

// 2. Define Memory Storage (Specifically for the ATS AI Scan)
const memoryStorage = multer.memoryStorage();

// 3. Setup File Filtering
const fileFilter = (req, file, cb) => {
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const allowedDocTypes = [
        'application/pdf', 
        'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (file.fieldname === 'resume' || file.fieldname === 'resumes') {
        if (allowedDocTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only PDF and Word documents are allowed!'), false);
        }
    } else {
        if (allowedImageTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed for profiles!'), false);
        }
    }
};

// 4. THE SMART SWITCH: Decide storage based on the route
const upload = multer({ 
    storage: {
        _handleFile: (req, file, cb) => {
            // If the route involves 'ats' or 'apply', use memory for the AI scan.
            // Otherwise, save it to the disk.
            const engine = (req.originalUrl.includes('/ats') || req.originalUrl.includes('/apply')) 
                           ? memoryStorage 
                           : diskStorage;
            engine._handleFile(req, file, cb);
        },
        _removeFile: (req, file, cb) => {
            const engine = (req.originalUrl.includes('/ats') || req.originalUrl.includes('/apply')) 
                           ? memoryStorage 
                           : diskStorage;
            engine._removeFile(req, file, cb);
        }
    },
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } 
});

module.exports = upload;