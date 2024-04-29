const multer = require('multer');
const path = require('path');
const fs = require('fs');

function ensureFolderExists(folderPath) {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
}

function getDestination(req, file, cb) {
  const folderName = 'BlogImages'; 
  const destination = path.join(__dirname, '..', 'public', 'assets', folderName);
  ensureFolderExists(destination);
  cb(null, destination);
}

const storageConfig = multer.diskStorage({
  destination: getDestination,
  filename: function (req, file, cb) {
    const uniqueFilename = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueFilename);
  },
});

function checkFileType(file, cb, next) {
  if (!file || !file.originalname || !file.mimetype) {
    next(new Error('Invalid file.'));
    return;
  }
  const allowedFileTypes = /jpeg|jpg|png/;
  const extensionName = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = allowedFileTypes.test(file.mimetype);

  if (extensionName && mimeType) {
    cb(null, true);
  } else {
    cb(new Error('Error: Only JPEG and PNG files are allowed!'));
  }
}

const blogImagesMulter = multer({
  storage: storageConfig,
  limits: { fileSize: 50000000 }, 
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb, () => {});
  },
}).array('blog_images');

module.exports = blogImagesMulter;
