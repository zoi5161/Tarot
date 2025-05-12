import React, { useEffect, useState } from 'react';
import styles from './Navbar.module.css';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isServiceClicked, setIsServiceClicked] = useState(false);
  const navigate = useNavigate(); // Moved useNavigate here, inside the component body

  const handleServiceClick = () => {
    setIsServiceClicked(true);
  };

  const handlePredictClick = () => {
    navigate('/Predict');
    window.scrollTo(0, 0);
  };

  const handleShopClick = () => {
    navigate('/Shop');
    window.scrollTo(0, 0);
  };

  const handleHomeClick = () => {
    navigate('/');
    window.scrollTo(0, 0);
  };

  const handleAboutUsClick = () => {
    navigate('/AboutUs');
    window.scrollTo(0, 0);
  };

  const handleBlogClick = () => {
    navigate('/Blog');
    window.scrollTo(0, 0);
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
        <li className={styles.navItem}><a onClick={handleHomeClick}>TRANG CHỦ</a></li>
        <li className={styles.navItem}><a onClick={handlePredictClick}>BÓI BÀI TAROT</a></li>
        <li className={styles.navItem}><a onClick={handleShopClick}>CỬA HÀNG</a></li>
      </ul>
      <a onClick={handleHomeClick} className={styles.logo}>
        <img src="/logo.png" alt="Logo" className={styles.logoImage} />
      </a>
      <ul className={styles.navList2}>
        <li className={styles.navItem}><a onClick={handleAboutUsClick}>VỀ CHÚNG TÔI</a></li>
        <li className={styles.navItem}><a onClick={handleBlogClick}>BLOG</a></li>
        <li className={styles.navItem}><a onClick={handleServiceClick} className={styles.service}>DỊCH VỤ</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;
