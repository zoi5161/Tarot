import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../../components/Navbar';
import FloatingParticles from '../../components/FloatingParticles/FloatingParticles';
import styles from './Home.module.css';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [imgSrc, setImgSrc] = useState("/imageInfor.png");

  const handleBoxPredictClick = () => {
    navigate('/Predict');
    window.scrollTo(0, 0);
  };

  const handleBoxShopClick = () => {
    navigate('/Shop');
    window.scrollTo(0, 0);
  };

  const handleBoxBlogClick = () => {
    navigate('/Blog');
    window.scrollTo(0, 0);
  };

  const handleLogoClick = () => {
    const element = document.getElementById('containerTop');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleMouseEnter = () => {
    setImgSrc("/imageInforRed.png");
  };

  const handleMouseLeave = () => {
    setImgSrc("/imageInfor.png");
  };


  return (
    <div className={styles.container}>
        <div id="containerTop" className={styles.containerWelcome}>
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
        <div id='ourService' className={styles.containerOurInfor}>
            <FloatingParticles count={200} />
            <div className={styles.header}>
              <h1>ĐẾN VỚI CHÚNG TÔI, BẠN CÓ THỂ TRẢI NGHIỆM</h1>
              <div className={styles.listBox}>
                <div className={styles.box} onClick={handleBoxPredictClick}>
                  <div className={styles.headBox}>TRẢI BÀI TAROT TRỰC TUYẾN</div>
                  <div className={styles.contentBox}>
                    - Trải bài nhanh theo chủ đề tình cảm, sự nghiệp, nội tâm
                    <span><br/>- Trải bài chi tiết 1:1 cùng Reader chuyên nghiệp</span>
                  </div>
                </div>
                <div className={styles.box} onClick={handleBoxShopClick}>
                  <div className={styles.headBox}>CỬA HÀNG TÂM LINH</div>
                  <div className={styles.contentBox}>
                    - Bài Tarot, Oracle
                    <span><br/>- Tinh thể, đá chữa lành, nhang xông, sách</span>
                    
                    <br/>- Sản phẩm thủ công mang năng lượng cao
                  </div>
                </div>
                <div className={styles.box} onClick={handleBoxBlogClick}>
                  <div className={styles.headBox}>BLOG VÀ HỌC TAROT</div>
                  <div className={styles.contentBox}>
                    - Giải nghĩa lá bài
                    <span><br/>- Hướng dẫn học Tarot từ cơ bản đến nâng cao</span>
                    
                    <br/>- Chia sẻ góc nhìn về tâm linh hiện đại và chữa lành nội tâm
                  </div>
                </div>
              </div>
              <div className={styles.inforFooter}>
                <div className={styles.leftInforFooter}>
                  <img src="hand.png" alt="" className={styles.imageJump}/>
                </div>
                <div className={styles.rightInforFooter}>Tarot là một hệ thống biểu tượng cổ xưa được thể hiện qua 78 lá bài, dùng để chiêm nghiệm, phản ánh nội tâm và hướng dẫn con người trong hành trình sống. Mỗi lá bài mang trong mình những hình ảnh giàu biểu tượng và nhiều tầng ý nghĩa, giúp người xem kết nối với cảm xúc, tiềm thức và trực giác của chính mình. Tarot không phải để "đoán vận mệnh", mà là công cụ để soi sáng những lựa chọn, hiểu rõ bối cảnh và đưa ra quyết định sáng suốt hơn. Bằng cách đặt câu hỏi cụ thể và lắng nghe thông điệp từ các lá bài, người dùng có thể tự tìm thấy câu trả lời cho những điều đang băn khoăn. Tarot phù hợp với cả người tin vào tâm linh lẫn những ai tìm kiếm sự kết nối với bản thân theo hướng tâm lý – phản tư. Với mỗi lần trải bài là một lần đối thoại chân thành với chính mình.</div>
             </div>
            </div>
            <div className={styles.hr}></div>
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
    </div>
  );
};

export default Home;