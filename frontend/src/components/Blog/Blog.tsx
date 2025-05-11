import React from 'react';
import styles from './Blog.module.css';

const blogs = [
  {
    id: 1,
    image: 'blog1.jpg',
    title: 'Tiêu đề bài viết 1',
    shortDescription: 'Mô tả ngắn bài viết 1',
    content: 'Nội dung chi tiết bài viết 1',
    publishDate: '01/01/2023'
  },
  {
    id: 2,
    image: 'blog2.jpg',
    title: 'Tiêu đề bài viết 2',
    shortDescription: 'Mô tả ngắn bài viết 2',
    content: 'Nội dung chi tiết bài viết 2',
    publishDate: '05/01/2023'
  },
  // Thêm các bài viết khác
];

const Blog = () => {
  return (
    <div className={styles.blogTable}>
      {blogs.map((blog) => (
        <div key={blog.id} className={styles.blogCard}>
          <img src={blog.image} alt={blog.title} className={styles.blogImage} />
          <div className={styles.blogInfo}>
            <h3>{blog.title}</h3>
            <p>{blog.shortDescription}</p>
            <p>{blog.content}</p>
            <p><strong>Ngày đăng:</strong> {blog.publishDate}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Blog;