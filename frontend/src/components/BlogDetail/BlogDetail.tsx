import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../NavBar/Navbar';
import FloatingParticles from '../../components/FloatingParticles/FloatingParticles';
import styles from './BlogDetail.module.css';
import BlogCard from '../BlogCard/BlogCard';

interface Post {
  _id: number;
  title: string;
  shortDescription: string;
  description: string;
  content: string;
  image: string;
  date: string;
}

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const BlogDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // Lấy _id từ URL (thực tế là _id trong MongoDB)
  const [post, setPost] = useState<Post | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(1);


  const handleCardClick = (postId: number) => {
    navigate(`/blog/${postId}`);
  };

// Lọc ngẫu nhiên 4 bài post khác với bài đang xem
const currentPosts = posts
  .filter((p) => p._id !== post?._id) // loại bài hiện tại
  .sort(() => 0.5 - Math.random()) // shuffle
  .slice(0, 4); // lấy 4 bài


  useEffect(() => {
    const fetchPost = async () => {
      try {
        // Gọi API để lấy chi tiết bài viết theo ID
        const response = await fetch(`${backendUrl}/api/blogs/${id}`);
        const postData = await response.json();
        
        // Cập nhật bài viết
        setPost({
          _id: postData._id, // MongoDB trả về _id, không phải id
          title: postData.title,
          shortDescription: postData.shortDescription,
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
      <div className={styles.title}>{post.title}</div>
      <p className={styles.date}>{post.date}</p>
      <div className={styles.blogDetail}>
        <div className={styles.content}>
          <img src={`${backendUrl}${post.image}`} alt={post.title} className={styles.image} />
          <div className={styles.description}>
            {formattedContent}
          </div>
        </div>
        <div className={styles.rightPanel}>
          <div className={styles.blogListRef}>
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
        </div>
      </div>


    </div>
  );
};

export default BlogDetail;
