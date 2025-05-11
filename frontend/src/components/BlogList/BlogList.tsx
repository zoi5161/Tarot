import React, { useState, useEffect, useRef } from 'react';
import BlogCard from '../BlogCard/BlogCard';
import { useNavigate } from 'react-router-dom';
import styles from './BlogList.module.css';

interface Post {
  id: number;
  title: string;
  description: string;
  content: string;
  imageSrc: string;
  date: string;
}

const BlogList: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 4;

  // Sử dụng useRef để tham chiếu đến phần tử blogListRef
  const blogListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPosts = async () => {
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
        
        setPosts(postsArray);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  // Điều hướng đến trang chi tiết bài viết
  const handleCardClick = (postId: number) => {
    navigate(`/blog/${postId}`);
  };

  // Hàm để chuyển trang và cuộn đến BlogList
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    if (blogListRef.current) {
      blogListRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const totalPages = Math.ceil(posts.length / postsPerPage);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className={styles.blogList}>
      {/* Sử dụng ref để tham chiếu đến phần tử */}
      <div ref={blogListRef} className={styles.blogListRef}>
        <div className={styles.blogCards}>
          {currentPosts.map((post) => (
            <BlogCard
              key={post.id}
              title={post.title}
              description={post.description}
              content={post.content}
              src={post.imageSrc}
              date={post.date}
              onClick={() => handleCardClick(post.id)} // Điều hướng khi click
            />
          ))}
        </div>
      </div>
      <div className={styles.pagination}>
        <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
          Prev
        </button>
        <div className={styles.pageNumbers}>
          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={currentPage === number ? styles.activePage : ''}
            >
              {number}
            </button>
          ))}
        </div>
        <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default BlogList;
