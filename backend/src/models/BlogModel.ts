import mongoose, { Schema, Document } from 'mongoose';

interface Blog extends Document {
  image: string;
  title: string;
  shortDescription: string;
  content: string;
  publishDate: Date;
}

const blogSchema = new Schema<Blog>({
  image: { type: String, required: true },
  title: { type: String, required: true },
  shortDescription: { type: String, required: true },
  content: { type: String, required: true },
  publishDate: { type: Date, required: true },
});

const Blog = mongoose.model<Blog>('Blog', blogSchema);
export default Blog;