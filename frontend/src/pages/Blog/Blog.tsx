import React, { useRef } from 'react';
import BlogList from '../../components/BlogList/BlogList';
import Navbar from '../../components/NavBar/Navbar';
import FloatingParticles from '../../components/FloatingParticles/FloatingParticles';
import styles from './Blog.module.css';

const Blog: React.FC = () => {
  // Tạo ref để tham chiếu đến BlogList
  const blogListRef = useRef<HTMLDivElement>(null);

  // Hàm cuộn đến BlogList khi click vào tiêu đề "BLOG"
  const scrollToBlogList = () => {
    if (blogListRef.current) {
      blogListRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.containerWelcome}>
        <Navbar />
        <div className={styles.containerHeaderBlog}>
          <h1 className={styles.headerBlog}>CHÀO MỪNG ĐẾN VỚI BLOG TAROCITOPIA</h1>
          <p className={styles.blogDescription}>
            Blog Tarot là nơi bạn có thể tìm thấy những bài viết thú vị về Tarot, từ các hướng dẫn cơ bản đến các bài viết chuyên sâu về cách sử dụng Tarot để khám phá bản thân và định hướng tương lai. Chúng tôi cung cấp những thông tin bổ ích, những câu chuyện và các mẹo vặt giúp bạn kết nối với những lá bài Tarot một cách dễ dàng và hiệu quả.
          </p>
          <p className={styles.blogDescription}>
            Dù bạn là người mới bắt đầu hay là một Tarot reader chuyên nghiệp, bạn đều có thể tìm thấy những bài viết hữu ích để phát triển kỹ năng của mình. Hãy cùng khám phá thế giới Tarot qua các bài viết sâu sắc và truyền cảm hứng của chúng tôi!
          </p>
          <span 
            className={styles.blogTitle} 
            onClick={scrollToBlogList} // Thêm sự kiện click để cuộn xuống BlogList
          >
            BLOG
          </span>
          <img src="/blogTitle.svg" alt="blogTitle" className={styles.blogImage} />
        </div>
      </div>
      <div className={styles.containerOurInfor}>
        <FloatingParticles count={200} />
        {/* Gắn ref vào BlogList */}
        <div className={styles.blogListRef} ref={blogListRef}>
          <BlogList />
        </div>
      </div>
    </div>
  );
};

export default Blog;
