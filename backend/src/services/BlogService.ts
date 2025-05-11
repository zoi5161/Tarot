import Blog from '../models/BlogModel';

export const createBlog = async (blogData: any) => {
  try {
    const newBlog = new Blog(blogData);
    await newBlog.save();
    return newBlog;
  } catch (error) {
    throw new Error('Error saving blog: ' + error);
  }
};