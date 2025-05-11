import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDir = path.join(__dirname, '../../uploads');

// Kiểm tra và tạo thư mục uploads nếu chưa tồn tại
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const router = express.Router();

// Cấu hình lưu trữ ảnh
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Thư mục lưu trữ ảnh
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Tạo tên file duy nhất
  },
});

const upload = multer({ storage });

// API upload ảnh
router.post('/upload-image', upload.single('image'), (req: Request, res: Response) => {
  if (req.file) {
    // Trả về URL của ảnh vừa upload
    res.json({ imageUrl: `/uploads/${req.file.filename}` });
  } else {
    res.status(400).send('Error uploading image');
  }
});

export default router;
