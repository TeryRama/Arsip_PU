const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // folder upload
  },
  filename: (req, file, cb) => {
    const unique = new Date().toISOString().replace(/:/g, '-');
    cb(null, unique + '_' + file.originalname);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (path.extname(file.originalname).toLowerCase() !== '.pdf') {
      return cb(new Error('Hanya file PDF yang diperbolehkan!'));
    }
    cb(null, true);
  }
});

module.exports = upload;
