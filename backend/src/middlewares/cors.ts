import { Request, Response, NextFunction } from 'express';

const corsMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5678');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,Access-Control-Allow-Headers,Access-Control-Allow-Origin');

  // Nếu là yêu cầu OPTIONS, trả về phản hồi thành công ngay lập tức
  if (req.method === 'OPTIONS') {
    res.status(200).end();  // Gửi phản hồi 200 mà không trả về giá trị gì
    return;  // Dừng lại ở đây, không gọi next()
  }

  next(); // Chuyển tiếp đến middleware hoặc route tiếp theo
};

export default corsMiddleware;
