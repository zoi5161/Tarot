import express, { Request, Response } from 'express';
import { createBlogController } from '../controllers/BlogController';
import Blog from '../models/BlogModel';

const router = express.Router();

router.post('/blogs', async (req: Request, res: Response) => {
  try {
    await createBlogController(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

router.get('/blogs', async (req: Request, res: Response) => {
  try {
    const blogs = await Blog.find(); 
    res.status(200).json(blogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving blogs', error: error });
  }
});

router.get('/blogs/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      res.status(404).json({ message: 'Blog not found' });
    }
    res.status(200).json(blog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving blog', error: error });
  }
});

router.put('/blogs/:id', async (req: Request, res: Response) => {
  try {
    const blogId = req.params.id;
    const updatedBlogData = req.body;

    // Cập nhật sản phẩm trong database
    const updatedBlog = await Blog.findByIdAndUpdate(blogId, updatedBlogData, { new: true });

    res.status(200).json({
      message: 'Blog updated successfully',
      blog: updatedBlog,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating blog', error: error });
  }
});

router.delete('/blogs/:id', async (req: Request, res: Response) => {
  try {
    const blogId = req.params.id;

    // Tìm và xóa sản phẩm trong cơ sở dữ liệu
    const deletedBlog = await Blog.findByIdAndDelete(blogId);

    res.status(200).json({
      message: 'Blog deleted successfully',
      blog: deletedBlog,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting blog', error: error });
  }
});

export default router;
