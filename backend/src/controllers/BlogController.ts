import { Request, Response } from 'express';
import { createBlog } from '../services/BlogService';

export const createBlogController = async (req: Request, res: Response) => {
  try {
    const blogData = req.body;
    const newBlog = await createBlog(blogData);
    res.status(201).json({
      message: 'Blog created successfully',
      blog: newBlog
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating blog', error: error });
  }
};
