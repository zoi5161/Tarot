import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../NavBar/Navbar';
import FloatingParticles from '../../components/FloatingParticles/FloatingParticles';
import styles from './BlogDetail.module.css';

interface Post {
  id: number;
  title: string;
  description: string;
  content: string;
  imageSrc: string;
  date: string;
}

const BlogDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Lấy id từ URL
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch('/posts.txt');
        const text = await response.text();

        const postsArray: Post[] = text.split('\n').map(line => {
          const [id, title, description, content, date, imageSrc] = line.split('|');
          return {
            id: parseInt(id),
            title,
            description,
            content,
            date,
            imageSrc,
          };
        });

        // Tìm bài viết theo ID
        const selectedPost = postsArray.find(post => post.id === parseInt(id!));
        setPost(selectedPost || null);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    fetchPost();
  }, [id]); // Lấy lại dữ liệu mỗi khi id thay đổi

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <Navbar />
      <FloatingParticles count={50} />
      <h1 className={styles.title}>{post.title}</h1>
      <p className={styles.date}>{post.date}</p>
      <div className={styles.content}>
        <img src={post.imageSrc} alt={post.title} className={styles.image} />
        <div className={styles.description}>
          <p>{post.content}</p>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
