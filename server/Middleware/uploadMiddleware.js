const multer = require('multer');
const path = require('path');

// Set up storage engine for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/user'); // Define the folder to save the files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Use a timestamp to ensure unique filenames
  },
});

// File filter to ensure only image files are uploaded
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Set up multer with storage, file size limit, and file filter
const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB file size limit
  fileFilter: fileFilter,
});

// Middleware function to handle single file uploads
const uploadHandler = upload.single('image'); // Adjust the field name if necessary

// Export the upload handler to use in routes
const handleFileUpload = (req, res, next) => {
  uploadHandler(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'Maximum file size is 2MB.' });
      }
      return res.status(400).json({ message: err.message });
    } else if (err) {
      return res.status(500).json({ message: 'File upload failed.' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded!' });
    }

    next(); // If no errors, proceed to the next middleware or controller
  });
};

module.exports = handleFileUpload;
