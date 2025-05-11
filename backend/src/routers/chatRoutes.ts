import { Router, Request, Response } from 'express';  // Đảm bảo import đúng các kiểu
import { getGeminiResponse } from '../controllers/ChatController';

const router = Router();

// Đảm bảo kiểu hàm xử lý route đúng
router.post('/ask-gemini', async (req: Request, res: Response) => {
  try {
    await getGeminiResponse(req, res);  // Gọi controller mà không bị lỗi kiểu
  } catch (error) {
    res.status(500).json({ error: 'Có lỗi xảy ra khi gọi Gemini API' });
  }
});

export default router;
