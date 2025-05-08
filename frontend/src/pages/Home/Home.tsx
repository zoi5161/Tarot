import React from 'react';
import styles from './Home.module.css';

const Home = () => {
  return (
    <div className={styles.container}>
      <div className={styles.containerWelcome}>
        {/* Navbar */}
        <nav className={styles.navbar}>
          <a href="#" className={styles.logo}>
            <img src="/logo.png" alt="Logo" className={styles.logoImage} />
            TAROTICA
          </a>
          <ul className={styles.navList}>
            <li className={styles.navItem}><a href="#">SHOP BÀI TAROT</a></li>
            <li className={styles.navItem}><a href="#">BLOG</a></li>
            <li className={styles.navItem}><a href="#">ĐĂNG KÝ</a></li>
            <li className={styles.navItem}><a href="#">ĐĂNG NHẬP</a></li>
          </ul>
        </nav>

        {/* Content */}
        <div className={styles.banner}>
          <h1 className={styles.titleBlack}>
            <span className={styles.westmins}>T</span>
            arotica
          </h1>
          <h1 className={styles.title}>
            <span className={styles.westmins}>T</span>
            arotica
          </h1>

          <h2 className={styles.smallTitle}>BÓI BÀI TAROT ONLINE</h2>
          <h2 className={styles.smallTitle}>NHẬN ĐƯỢC CÂU TRẢ LỜI BẠN CẦN VỚI <br/>
          <span className={styles.number}>3 </span>
          LÁ BÀI TAROT</h2>
        </div>
      </div>
    </div>
  );
};

export default Home;
