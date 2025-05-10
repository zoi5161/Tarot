import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../../components/Navbar';
import styles from './Home.module.css';

const Home = () => {
  return (
    <div className={styles.container}>
        <div className={styles.containerWelcome}>
            <Navbar />
            <div className={styles.containerHead}>
              <div className={styles.infor}>
                <div className={styles.infor1}>
                  Chạm vào chiều sâu tiềm thức 
                  <br/>Giải mã con đường bạn đang đi.
                </div>
                <div className={styles.infor2}>
                  XEM TAROT MIỄN PHÍ MỖI NGÀY 
                  <br/>TẠI TAROCITOPIA
                </div>
                <div className={styles.infor3}>
                  Tại đây, chúng tôi tạo nên không gian kết nối giữa Tarot, tâm linh và chữa lành. Website của chúng tôi là điểm đến dành cho những ai đang tìm kiếm sự thấu hiểu bản thân, định hướng cuộc sống và khám phá những tầng sâu của tiềm thức.
                </div>
              </div>

              <div className={styles.logo}>
                <img src="/imageInfor.png" alt="Logo" />
              </div>
            </div>
        </div>
        <div className={styles.containerOurInfor}>
            <h1>ĐẾN VỚI CHÚNG TÔI, BẠN CÓ THỂ TRẢI NGHIỆM</h1>
            <div className={styles.listBox}>
              <div className={styles.box}>
                <div className={styles.headBox}>TRẢI BÀI TAROT TRỰC TUYẾN</div>
                <div className={styles.contentBox}>
                  - Trải bài nhanh theo chủ đề tình cảm, sự nghiệp, nội tâm
                  <span><br/>- Trải bài chi tiết 1:1 cùng Reader chuyên nghiệp</span>
                </div>
              </div>
              <div className={styles.box}>
                <div className={styles.headBox}>CỬA HÀNG TÂM LINH</div>
                <div className={styles.contentBox}>
                  - Bài Tarot, Oracle
                  <span><br/>- Tinh thể, đá chữa lành, nhang xông, sách</span>
                  
                  <br/>- Sản phẩm thủ công mang năng lượng cao
                </div>
              </div>
              <div className={styles.box}>
                <div className={styles.headBox}>BLOG VÀ HỌC TAROT</div>
                <div className={styles.contentBox}>
                  - Giải nghĩa lá bài
                  <span><br/>- Hướng dẫn học Tarot từ cơ bản đến nâng cao</span>
                  
                  <br/>- Chia sẻ góc nhìn về tâm linh hiện đại và chữa lành nội tâm
                </div>
              </div>
            </div>
        </div>
    </div>
  );
};

export default Home;