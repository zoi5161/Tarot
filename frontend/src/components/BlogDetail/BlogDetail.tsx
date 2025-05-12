import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../NavBar/Navbar';
import FloatingParticles from '../../components/FloatingParticles/FloatingParticles';
import styles from './BlogDetail.module.css';

interface Post {
  _id: string; // Sử dụng _id thay vì id
  title: string;
  description: string;
  content: string;
  image: string;
  date: string;
}

const BlogDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Lấy _id từ URL (thực tế là _id trong MongoDB)
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        // Gọi API để lấy chi tiết bài viết theo ID
        const response = await fetch(`http://localhost:1234/api/blogs/${id}`);
        const postData = await response.json();
        
        // Cập nhật bài viết
        setPost({
          _id: postData._id, // MongoDB trả về _id, không phải id
          title: postData.title,
          description: postData.description,
          content: postData.content,
          date: postData.publishDate,
          image: postData.image,
        });
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    fetchPost();
  }, [id]);

  if (!post) {
    return <div>Loading...</div>;
  }

  // Thay thế \n bằng <br /> trong nội dung bài viết
  const formattedContent = post.content.split('\n').map((str, index) => (
    <React.Fragment key={index}>
      {str}
      <br />
    </React.Fragment>
  ));

  return (
    <div className={styles.container}>
      <Navbar />
      <FloatingParticles count={50} />
      <h1 className={styles.title}>{post.title}</h1>
      <p className={styles.date}>{post.date}</p>
      <div className={styles.content}>
        <img src={`http://localhost:1234${post.image}`} alt={post.title} className={styles.image} />
        <div className={styles.description}>
          {formattedContent}
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
