import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
const apiKey = process.env.GEMINI_API_KEY; // Đảm bảo bạn đã cấu hình API key cho Gemini
if (!apiKey) {
  throw new Error("API key is missing");
}

const geminiAPIUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';  // Đặt đúng URL endpoint của Gemini API

export const getGeminiResponse = async (prompt: string): Promise<string> => {
  try {
    // Cấu hình dữ liệu yêu cầu gửi tới API
    const response = await axios.post(geminiAPIUrl, {
      contents: [
        {
          parts: [
            {
              text: prompt, // Truyền nội dung yêu cầu
            }
          ]
        }
      ],
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
      params: {
        key: apiKey, // API key của bạn
      },
    });

    // Kiểm tra nếu API trả về dữ liệu đúng
    if (response.data && response.data.candidates && response.data.candidates.length > 0) {
      const content = response.data.candidates[0].content;

      // Log toàn bộ cấu trúc content để kiểm tra
      console.log('Cấu trúc dữ liệu trả về từ Gemini API:', content);

      // Kiểm tra xem content có chứa mảng parts không
      if (content && content.parts && content.parts.length > 0) {
        // Lấy phần tử đầu tiên trong parts và lấy trường 'text'
        const textContent = content.parts[0].text;
        if (textContent) {
          return textContent.trim();  // Trả về kết quả văn bản từ trường 'text'
        } else {
          console.error('Không có trường "text" trong parts:', content.parts[0]); // Log nếu không có trường 'text'
          throw new Error('Không có kết quả văn bản trong content');
        }
      } else {
        console.error('Không có trường "parts" hoặc "parts" rỗng:', content);  // Log nếu không có trường 'parts'
        throw new Error('Không có kết quả văn bản trong content');
      }
    } else {
      console.error('Response data is empty or invalid:', response.data);  // Log nếu không có kết quả trả về
      throw new Error('No result in response');
    }
  } catch (error) {
    console.error("Error from Gemini API:", error);  // Log lỗi chi tiết
    throw new Error('Error connecting to Gemini API');
  }
};
