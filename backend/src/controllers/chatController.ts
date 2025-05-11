import { Request, Response } from 'express';
import { getGeminiResponse as getGemini } from '../models/ChatModel'; // Gọi hàm từ model

export const getGeminiResponse = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Gọi hàm từ model để truy vấn Gemini API
    const answer = await getGemini(prompt);

    // Trả về kết quả từ API
    return res.json({ answer });
  } catch (error) {
    console.error('Lỗi khi truy vấn Gemini API:', error);
    return res.status(500).json({ error: 'Không thể nhận được câu trả lời từ Gemini API' });
  }
};
