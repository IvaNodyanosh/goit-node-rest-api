import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, "../tmp");

const storage = multer.diskStorage({
  destination: (__, ___, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user._id}_${file.originalname}`);
  },
});

export const upload = multer({ storage });
