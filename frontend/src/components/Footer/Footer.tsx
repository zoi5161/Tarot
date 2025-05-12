import React, { useState, useEffect, useRef } from 'react';
import styles from './Footer.module.css';
import { useLocation, useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoClick = () => {
    if (location.pathname === '/') {
      const element = document.getElementById('containerTop');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/');
      window.scrollTo(0, 0);
    }
  };


  return (
        <div className={styles.containerFooter}>
            <div className={styles.footer}>
                <div className={styles.leftPanel}>
                <div className={styles.titleLeftFooter}>TRANG WEB XEM TAROT MIỄN PHÍ MỖI NGÀY TAROCITOPIA</div>
                <img onClick={handleLogoClick} src="logo.png" alt="Logo" className={styles.logoFooter}/>
                <div className={styles.descriptionLeftFooter}>
                    Thấu cảm - Chữa lành
                    <br/>Đi cùng bạn trên hành trình thức tỉnh nội tâm
                </div>
                </div>
                <div className={styles.rightPanel}>
                <div className={styles.titleRightPanel}>Mọi ý kiến đóng góp xin vui lòng liên hệ:</div>
                <ul>
                    <li>Email: tarocitopia.online@gmail.com</li>
                    <li>Số điện thoại: 0777.777.777</li>
                    <li>Fanpage: Xem tarot online Tarocitopia</li>
                </ul>
                </div>
            </div>
        </div>
    );
};

export default Footer;