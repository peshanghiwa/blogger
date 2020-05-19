const multer = require("multer");
const sharp = require("sharp");
const ErrorBuilder = require("../Utils/ErrorBuilder");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) cb(null, true);
  else cb(new ErrorBuilder("not an image file type"), false);
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});
exports.upload = upload.single("photo");

exports.resize = async (req, res, next) => {
  try {
    if (!req.file) return next();
    req.file.filename = `post-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`./assets/images/posts/${req.file.filename}`, err => {
        if (err) {
          next(err);
        }
      });
    next();
  } catch (err) {
    return next(err);
  }
};
