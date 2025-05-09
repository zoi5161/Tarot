import React, { useState, useEffect, useRef } from 'react';
import styles from './Home.module.css';

const Home = () => {
  const [selectedTheme, setSelectedTheme] = useState("CHỌN CHỦ ĐỀ");
  const [isThemeOpen, setIsThemeOpen] = useState(false); 
  const [showProcessCard, setShowProcessCard] = useState(false);
  const [cardPositions, setCardPositions] = useState(() => {
    // Tạo một mảng có 78 phần tử, với các phần tử từ 3 đến 77 có giá trị là 20, các phần tử còn lại là 0
    const positions = Array(78).fill(0); // Khởi tạo tất cả phần tử với giá trị 0
    for (let i = 2; i < 77; i++) {
      positions[i] = 20; // Đặt giá trị là 20 cho các vị trí từ 3 đến 77 (chỉ số từ 2 đến 76)
    }
    return positions; // Trả về mảng đã được cập nhật
  });  
  const [animationStarted, setAnimationStarted] = useState(false); // Kiểm tra nếu animation đã bắt đầu hay chưa
  const [positionCard3Animation, setPositionCard3Animation] = useState([0, 0]); // Vị trí của lá bài thứ 3 (translateX, translateY)
  const [positionCard2Animation, setPositionCard2Animation] = useState([0, 0]); // Vị trí của lá bài thứ 2
  const [zIndexCard3Animation, setZIndexCard3Animation] = useState(0); // z-index của lá bài thứ 3
  const [isShuffling, setIsShuffling] = useState(false); // Trạng thái xào bài
  const [isShufflingCompleted, setIsShufflingCompleted] = useState(false); // Trạng thái xào bài đã hoàn thành
  const themeDropdownRef = useRef<HTMLDivElement>(null);

  const handleThemeSelect = (value: string) => {
    setSelectedTheme(value);
    setIsThemeOpen(false); 
  };

  const toggleThemeDropdown = () => {
    setIsThemeOpen(!isThemeOpen); 
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      (themeDropdownRef.current && !themeDropdownRef.current.contains(event.target as Node))
    ) {
      setIsThemeOpen(false); 
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Hàm để bắt đầu animation trải các lá bài và XÀO BÀI
  const startCardAnimation = () => {
    setAnimationStarted(true);
    let positions = [0, 0, 0];
    setCardPositions(positions);

    const interval = setInterval(() => {
      positions[1] += 10;
      positions[2] += 20;

      if (positions[1] === 10) clearInterval(interval);

      setCardPositions([...positions]);
    }, 400);
  };

  const handleShuffleClick = () => {
    let counter = 0;
    setIsShuffling(true); // Bắt đầu quá trình xào bài
    setIsShufflingCompleted(false); // Đánh dấu chưa hoàn tất xào bài
  
    // Hàm sẽ thực hiện một lần "xào bài"
    const shuffleOnce = () => {
      // Các hiệu ứng sẽ được thực thi khi nhấn "XÀO BÀI"
      setPositionCard3Animation([-70, -20]);

      setTimeout(() => {
        setPositionCard3Animation([-30, -5]);
      }, 100);

      setTimeout(() => {
        setZIndexCard3Animation(-3);
      }, 150);

      setTimeout(() => {
        setPositionCard3Animation([0, 0]);
      }, 200);

      setTimeout(() => {
        setZIndexCard3Animation(3);
      }, 300);

      setTimeout(() => {
        setPositionCard2Animation([-5, 0]);
      }, 350);

      setTimeout(() => {
        setPositionCard2Animation([0, 0]);
      }, 400);
    };
  
    // Hàm lặp lại shuffleOnce 5 lần liên tiếp
    const loopShuffle = () => {
      if (counter < 7) {
        shuffleOnce();
        counter++;
        setTimeout(loopShuffle, 400);
      } else {
        // Khi xào bài xong, thay đổi trạng thái và cập nhật nút
        setIsShuffling(false);
        setIsShufflingCompleted(true); // Đánh dấu xào bài đã hoàn tất
      }
    };
  
    loopShuffle(); // Bắt đầu vòng lặp
  };

  useEffect(() => {
    if (selectedTheme !== "CHỌN CHỦ ĐỀ") {
      setShowProcessCard(true);
      startCardAnimation();
    }
  }, [selectedTheme]);

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

          {/* Dropdown Chủ Đề */}
          <div className={`${styles.chosenButton} ${styles.chosenSecondButton}`}>
            <div className={styles.dropdown}>
              <button className={styles.dropdownButton} onClick={toggleThemeDropdown}>
                {selectedTheme}
                <img 
                  src="/iconArrowDown.png" 
                  alt="Down Arrow" 
                  className={`${styles.arrowIcon} ${isThemeOpen ? styles.rotate : ''}`} 
                />
              </button>
              {isThemeOpen && (
                <ul className={styles.dropdownMenu}>
                  <li onClick={() => handleThemeSelect("TÌNH YÊU")}>TÌNH YÊU</li>
                  <li onClick={() => handleThemeSelect("CÔNG VIỆC")}>CÔNG VIỆC</li>
                  <li onClick={() => handleThemeSelect("SỨC KHOẺ")}>SỨC KHOẺ</li>
                  <li onClick={() => handleThemeSelect("TÀI CHÍNH")}>TÀI CHÍNH</li>
                </ul>
              )}
            </div>
          </div>

          {/* Chỉ hiển thị khi cả bộ bài và chủ đề đã được chọn */}
          {selectedTheme !== "CHỌN CHỦ ĐỀ" && (
            <div className={`${styles.processChosenCard} ${showProcessCard ? styles.show : ''}`}>
              <h2 className={styles.smallTitle} style={{ marginTop: `80px` }}>
                HÃY CHỌN LÁ BÀI CỦA BẠN
              </h2>
              <div className={styles.shuffleListCard}>
                <div className={styles.shuffleButton}>
                  <button onClick={handleShuffleClick} disabled={isShuffling}>
                    {isShuffling ? "ĐANG XÀO BÀI..." : (isShufflingCompleted ? "TRẢI BÀI" : "XÀO BÀI")}
                  </button>
                </div>

                <div className={styles.listCard}>
                  <div className={styles.card} style={{ left: `${cardPositions[0]}px` }}>
                    <img src="card.png" alt="Card" />
                  </div>
                  <div className={styles.card} style={{ left: `${cardPositions[1]}px`, transform: `translate(${positionCard2Animation[0]}px, ${positionCard2Animation[1]}px)` }}>
                    <img src="card.png" alt="Card" />
                  </div>
                  <div 
                    className={`${styles.card}`} 
                    style={{ 
                      left: `${cardPositions[2]}px`, 
                      transform: `translate(${positionCard3Animation[0]}px, ${positionCard3Animation[1]}px)`,
                      zIndex: zIndexCard3Animation 
                    }}
                  >
                    <img src="card.png" alt="Card" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
