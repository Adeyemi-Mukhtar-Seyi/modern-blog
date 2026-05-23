const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = 'uploads/';
    
    if (file.mimetype.startsWith('image/')) {
      uploadPath += 'images/';
    } else if (file.mimetype.startsWith('video/')) {
      uploadPath += 'videos/';
    } else if (file.mimetype.startsWith('audio/')) {
      uploadPath += 'audio/';
    } else {
      uploadPath += 'others/';
    }
    
    ensureDir(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});


// File filter
const fileFilter = (
  req,
  file,
  cb
) => {

  // ALLOW NO FILE
  if (!file) {
    return cb(null, true);
  }

  const allowed =

    file.mimetype.startsWith(
      'image/'
    ) ||

    file.mimetype.startsWith(
      'video/'
    ) ||

    file.mimetype.startsWith(
      'audio/'
    );

  if (allowed) {

    cb(null, true);

  } else {

    cb(
      new Error(
        'Unsupported file format. Upload image, video, or audio only.'
      ),
      false
    );
  }
};


const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  },
  fileFilter: fileFilter
});

module.exports = upload;