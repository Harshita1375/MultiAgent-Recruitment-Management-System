const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Ensure you have manually created a folder named 'uploads' in your Server root
        cb(null, './uploads/'); 
    },
    filename: (req, file, cb) => {
        // req.user is populated by authMiddleware
        const uniqueSuffix = `${req.user.id}-${Date.now()}`;
        cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

// Optional: Filter for image types only
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only images are allowed!'), false);
    }
};

module.exports = multer({ storage, fileFilter });