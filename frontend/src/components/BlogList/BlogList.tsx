import React, { useState, useEffect, useRef } from 'react';
import BlogCard from '../BlogCard/BlogCard';
import { useNavigate } from 'react-router-dom';
import styles from './BlogList.module.css';

interface Post {
  _id: number;
  title: string;
  shortDescription: string;
  content: string;
  image: string;
  date: string;
}

const backendUrl = process.env.REACT_APP_BACKEND_URL;

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
      // Gọi API để lấy dữ liệu blog từ database
      const response = await fetch(`${backendUrl}/api/blogs`); // Đảm bảo rằng URL API chính xác
      const data = await response.json(); // Dữ liệu nhận được từ API

      // Cập nhật các post từ dữ liệu API
      const postsArray: Post[] = data.map((post: any, index: number) => {
        return {
          _id: post._id, // Sử dụng thứ tự tăng dần từ 1
          title: post.title,
          shortDescription: post.shortDescription,
          content: post.content,
          date: post.publishDate,
          image: post.image,
        };
      });

      setPosts(postsArray); // Lưu bài viết vào state
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  fetchPosts();
}, []);


  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const handleCardClick = (postId: number) => {
    navigate(`/blog/${postId}`);
  };

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
              title={post.title}
              shortDescription={post.shortDescription}
              content={post.content}
              src={`${backendUrl}${post.image}`}
              date={post.date}
              onClick={() => handleCardClick(post._id)}
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
