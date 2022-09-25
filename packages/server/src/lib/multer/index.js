const multer = require('multer');
const path = require('path');
const appRoot = require('app-root-path');

const postPath = path.join(
  appRoot.path,
  'packages',
  'server',
  'public',
  'user',
);

const categoryPath = path.join(
  appRoot.path,
  'packages',
  'server',
  'public',
  'category',
);

const storageUser = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, postPath);
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const storageCategory = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, categoryPath);
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const uploadUser = multer({
  storage: storageUser,
  limits: {
    fileSize: 1048576, // Byte, 1 MB
  },
  fileFilter(req, file, cb) {
    const allowedExtension = ['.png', '.jpg', '.gif'];

    const extname = path.extname(file.originalname);

    if (!allowedExtension.includes(extname)) {
      const error = new Error('Please upload image file (jpg, png, gif)');
      return cb(error);
    }

    cb(null, true);
  },
});

const uploadCategory = multer({
  storage: storageCategory,
  fileFilter(req, file, cb) {
    const allowedExtension = ['.png', '.jpg', '.svg'];

    const extname = path.extname(file.originalname);

    if (!allowedExtension.includes(extname)) {
      const error = new Error('Please upload image file (jpg, png, svg)');
      return cb(error);
    }

    cb(null, true);
  },
});

module.exports = { uploadUser, uploadCategory };
