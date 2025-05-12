import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../../components/NavBar/Navbar';
import FloatingParticles from '../../components/FloatingParticles/FloatingParticles';
import Footer from '../../components/Footer/Footer';
import styles from './AboutUs.module.css';
import { useNavigate } from 'react-router-dom';

const AboutUs = () => {
  const memberListRef = useRef<HTMLDivElement>(null);
  const scrollToMemberList = () => {
    if (memberListRef.current) {
        memberListRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Mảng chứa thông tin các thành viên
  const members = [
    {
      name: "📚 HIẾU THUẬN",
      role: "Biên tập nội dung & kiểm duyệt kiến thức",
      avatar: "/members/TranGiaBao.jpg",
      content: "Là người đảm bảo mọi nội dung trên website đúng đắn, dễ hiểu và phù hợp với người mới lẫn người thực hành lâu năm. Thuận cũng biên tập tài liệu học tập và ebook cho cộng đồng."
    },
    {
      name: "💫 LINH",
      role: "Founder & Tarot Master",
      avatar: "/members/TranGiaBao.jpg",
      content: "\"Tarot là ngôn ngữ của tâm hồn.\" Linh là người sáng lập website, với hơn 8 năm thực hành Tarot, Reiki và chữa lành nội tâm. Chị chuyên về trải bài chuyên sâu (deep reading), khai vấn tâm lý và những chủ đề xoay quanh thức tỉnh tinh thần."
    },
    {
      name: "🔮 QUỲNH ANH",
      role: "Chuyên gia Tarot & Chiêm tinh",
      avatar: "/members/TranGiaBao.jpg",
      content: "Với nền tảng chiêm tinh học phương Tây và Tarot cổ điển, Quỳnh Anh giúp khách hàng kết nối giữa lá bài và vòng tròn sao số của họ. Anh đặc biệt giỏi đọc mối quan hệ và chuyển giao năng lượng giữa các chu kỳ cuộc đời."
    },
    {
      name: "🌙 KHA MY",
      role: "Hướng dẫn viên tâm linh & viết nội dung",
      avatar: "/members/TranGiaBao.jpg",
      content: "Kha My là người đứng sau những bài viết sâu sắc trên blog – cô có niềm đam mê bất tận với biểu tượng học, hành trình nữ thần và bóng tối nội tâm (shadow work)."
    },
    {
      name: "🌀 HƯƠNG GIANG",
      role: "Mentor Tarot nâng cao & đào tạo học viên",
      avatar: "/members/TranGiaBao.jpg",
      content: " Với kinh nghiệm giảng dạy Tarot trong hơn 5 năm, Giang phụ trách các khóa học Tarot từ cơ bản đến chuyên sâu. Phong cách logic – rõ ràng – dễ hiểu nhưng vẫn đầy chiều sâu."
    },
    {
      name: "🌟 MẪN ĐẠT",
      role: "Thiết kế website",
      avatar: "/members/TranGiaBao.jpg",
      content: "Đăng chuyên tạo ra các trải bài Tarot độc quyền cho từng chủ đề: inner child, self-worth, hành trình nghề nghiệp... Anh cũng là người nghiên cứu biểu tượng học và tâm lý học Jung để ứng dụng vào Tarot."
    },
    {
      name: "🔔 DUY ĐỨC",
      role: "Biên tập nội dung & kiểm duyệt kiến thức",
      avatar: "/members/TranGiaBao.jpg",
      content: "Duy Đức tư vấn cho khách hàng về tinh thể phù hợp sau khi xem bài. Anh có kiến thức về chakra, đá năng lượng và các phương pháp cân bằng tần số cá nhân sau quá trình 6 năm làm việc trong ngành đá tự nhiên."
    },
    {
      name: "🧘 GIA VINH",
      role: "Hướng dẫn thiền và làm việc với trực giác",
      avatar: "/members/TranGiaBao.jpg",
      content: "Gia Vinh hỗ trợ người xem bài kết nối tốt hơn với năng lượng bên trong thông qua thiền định, hơi thở và journaling. Đặc biệt phù hợp với những ai đang cần an yên và định tâm."
    },
  ];

  return (
    <div className={styles.container}>
        <div className={styles.containerWelcome}>
            <Navbar />
            <div className={styles.containerHead}>
                <div className={styles.title}>VỀ CHÚNG TÔI</div>
                <div className={styles.description}>
                    Phát triển từ cộng đồng của tarot reader nổi tiếng với hơn 10 năm kinh nghiệm - Chi de papillon, chúng tôi là những người đam mê Tarot, chiêm 
                    <br/>nghiệm tâm linh và hành trình phát triển bản thân. Với mong muốn tạo ra một không gian an toàn, sâu sắc và đầy cảm hứng, Tarocitopia ra đời 
                    <br/>như một cánh cổng kết nối bạn với trí tuệ cổ xưa, năng lượng vũ trụ và sự khai sáng từ bên trong.
                    <br/><br/>Tại Tarocitopia, chúng tôi không chỉ đơn thuần cung cấp các dịch vụ Tarot chuyên nghiệp mà còn mang đến những trải nghiệm sâu sắc giúp bạn 
                    <br />khám phá, chữa lành và phát triển. Chúng tôi tin rằng Tarot không chỉ là công cụ để giải mã tương lai mà còn là phương tiện giúp bạn hiểu rõ 
                    <br/>hơn về bản thân, về những ẩn khuất trong tâm hồn và năng lượng mà bạn đang mang trong người.
                    <br/><br/>Chúng tôi luôn đặt tâm huyết vào việc tạo dựng không gian khai sáng, nơi mọi người có thể tìm thấy sự an yên, thức tỉnh và hòa mình vào 
                    <br/>dòng chảy của sự khai mở tâm linh. Tarocitopia không chỉ là một nơi để tìm hiểu về Tarot, mà còn là cộng đồng kết nối những tâm hồn 
                    <br/>đồng điệu, nơi mỗi câu chuyện, mỗi trải nghiệm đều được tôn trọng và chia sẻ.
                </div>
                <span className={styles.blogTitle} onClick={scrollToMemberList}> MEMBERS </span>
                <img src="/blogTitle.svg" alt="blogTitle" className={styles.blogImage} />
            </div>
        </div>
        <div className={styles.containerOurInfor} ref={memberListRef}>
            <FloatingParticles count={100}/>
            <div className={styles.memberList}>
              {/* Dùng vòng lặp map để render danh sách thành viên */}
              {members.map((member, index) => (
                <div key={index} className={styles.member}>
                    <div className={styles.people}>
                        <div className={styles.avtPeople}>
                            <img src={member.avatar} alt={`Member ${index + 1}`} className={styles.avatar} />
                        </div>
                        <div className={styles.infoPeople}>
                            <div className={styles.topInfo}>
                                <div className={styles.name}>{member.name}</div>
                                <div className={styles.role}>{member.role}</div>
                            </div>
                            <div className={styles.content}>{member.content}</div>
                        </div>
                    </div>
                </div>
              ))}
            </div>
        </div>
        <Footer />
    </div>
  );
};

export default AboutUs;
