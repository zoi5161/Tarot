import React, { useEffect, useState } from 'react';
import styles from './Navbar.module.css';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isServiceClicked, setIsServiceClicked] = useState(false);
  const navigate = useNavigate(); // Moved useNavigate here, inside the component body

  const handleServiceClick = () => {
    setIsServiceClicked(true);
  };

  useEffect(() => {
    if (isServiceClicked) {
      navigate('/'); // Navigate to the home page

      setTimeout(() => {
        const element = document.getElementById('ourService');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);

      setIsServiceClicked(false);
    }
  }, [isServiceClicked, navigate]); // Added navigate to the dependency array

  return (
    <nav className={styles.navbar}>
      <ul className={styles.navList}>
        <li className={styles.navItem}><a href="/">TRANG CHỦ</a></li>
        <li className={styles.navItem}><a href="/Predict">BÓI BÀI TAROT</a></li>
        <li className={styles.navItem}><a href="/Shop">CỬA HÀNG</a></li>
      </ul>
      <a href="/" className={styles.logo}>
        <img src="/logo.png" alt="Logo" className={styles.logoImage} />
      </a>
      <ul className={styles.navList2}>
        <li className={styles.navItem}><a href="/AboutUs">VỀ CHÚNG TÔI</a></li>
        <li className={styles.navItem}><a href="/Blog">BLOG</a></li>
        <li className={styles.navItem}><a onClick={handleServiceClick} className={styles.service}>DỊCH VỤ</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;
