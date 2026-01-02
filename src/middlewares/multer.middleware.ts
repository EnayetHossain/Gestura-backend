import multer, { StorageEngine } from "multer";
import path from "path";

const storage: StorageEngine = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "public/uploads");
  },
  filename: (_, file, cb) => {
    // const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const fileName = `${file.originalname}`;
    cb(null, fileName);
  }
});

const fileFilter: multer.Options["fileFilter"] = (_, file, cb) => {
  if (path.extname(file.originalname).toLowerCase() !== ".exe") {
    return cb(new Error("Only .exe files are allowed"))
  }
  cb(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 500 // 500 MB
  }
});

export default upload;

