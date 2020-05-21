const multer = require("multer");
const ErrorBuilder = require("../Utils/ErrorBuilder");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + `/../../assets/images/users`);
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `user-${Date.now()}.${ext}`);
  }
});

const multerFilter = async (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else cb(new ErrorBuilder("not an image file type"), false);
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.upload = upload.single("photo");

// exports.resize = async (req, res, next) => {
//   try {
//     if (!req.file) return next();
//     req.file.filename = `user-${Date.now()}.jpeg`;

//     await sharp(req.file.buffer)
//       .resize(500, 500)
//       .toFormat("jpeg")
//       .jpeg({ quality: 90 })
//       .toFile(
//         __dirname + `/../../assets/images/users/${req.file.filename}`,
//         err => {
//           if (err) {
//           }
//         }
//       );
//     next();
//   } catch (err) {
//     return next(err);
//   }
// };
