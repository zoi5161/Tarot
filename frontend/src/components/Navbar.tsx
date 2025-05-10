import React from 'react';
import styles from './Navbar.module.css';

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <ul className={styles.navList}>
        <li className={styles.navItem}><a href="/">TRANG CHỦ</a></li>
        <li className={styles.navItem}><a href="/Predict">BÓI BÀI TAROT</a></li>
        <li className={styles.navItem}><a href="#">CỬA HÀNG</a></li>
      </ul>
      <a href="/" className={styles.logo}>
        <img src="/logo.png" alt="Logo" className={styles.logoImage} />
      </a>
      <ul className={styles.navList}>
        <li className={styles.navItem}><a href="#">VỀ CHÚNG TÔI</a></li>
        <li className={styles.navItem}><a href="#">BLOG</a></li>
        <li className={styles.navItem}><a href="#">DỊCH VỤ</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;