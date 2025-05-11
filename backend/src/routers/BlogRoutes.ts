import express, { Request, Response } from 'express';
import { createBlogController } from '../controllers/BlogController';

const router = express.Router();

router.post('/blogs', async (req: Request, res: Response) => {
  try {
    await createBlogController(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

export default router;
