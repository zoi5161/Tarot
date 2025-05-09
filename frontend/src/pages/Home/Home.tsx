import React, { useState, useEffect, useRef } from 'react';
import styles from './Home.module.css';

const Home = () => {
  const [selectedTheme, setSelectedTheme] = useState("CHỌN CHỦ ĐỀ");
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [showProcessCard, setShowProcessCard] = useState(false);
  const [cardPositions, setCardPositions] = useState(() => {
    // Tạo một mảng có 78 phần tử, với các phần tử từ 3 đến 77 có giá trị là 20, các phần tử còn lại là 0
    const positions = Array(78).fill(0);
    for (let i = 3; i < 77; i++) {
      positions[i] = 20; // Đặt giá trị là 20 cho các vị trí từ 3 đến 77
    }
    return positions;
  });
  const [animationStarted, setAnimationStarted] = useState(false);
  const [positionCard3Animation, setPositionCard3Animation] = useState([0, 0]);
  const [positionCard2Animation, setPositionCard2Animation] = useState([0, 0]);
  const [zIndexCard3Animation, setZIndexCard3Animation] = useState(3);
  const [isShuffling, setIsShuffling] = useState(false); // Trạng thái xào bài
  const [isShufflingCompleted, setIsShufflingCompleted] = useState(false); // Trạng thái xào bài đã hoàn thành
  const [isCardVisible, setIsCardVisible] = useState(false); // Để điều khiển việc hiển thị các lá bài
  const [shuffleButtonLeft, setShuffleButtonLeft] = useState('37%'); // Vị trí left của shuffleButton
  const [listCardLeft, setListCardLeft] = useState('37%'); // Vị trí left của listCard
  const [buttonLabel, setButtonLabel] = useState("XÀO BÀI"); // Trạng thái cho label của nút
  const [isSpreadCompleted, setIsSpreadCompleted] = useState(false);
  const [hiddenCards, setHiddenCards] = useState<number[]>([]); // Chỉ rõ kiểu là mảng số
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
      themeDropdownRef.current && !themeDropdownRef.current.contains(event.target as Node)
    ) {
      setIsThemeOpen(false);
    }
  };

  const handleCardClick = (index: number) => {
    if (hiddenCards.length < 3 && !hiddenCards.includes(index) && isSpreadCompleted) {
        // setHiddenCards([...hiddenCards, index]);
        // const newPositions = [...cardPositions];
    
        // // Dịch chuyển lá bài được click đến vị trí mới
        // newPositions[index] = {
        //   left: 20 + index * 50,  // Thay đổi vị trí `left`
        //   top: 500,               // Thay đổi vị trí `top`
        //   width: 300,             // Thay đổi kích thước khi click
        // };
      
        // setCardPositions(newPositions);
      }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

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

  // Hàm xào bài
  const handleShuffleClick = () => {
    if (isShufflingCompleted) {
      setShuffleButtonLeft('60px');
      setListCardLeft('0px');
      spreadCardAnimation();
      return;
    }

    let counter = 0;
    setIsShuffling(true); // Bắt đầu quá trình xào bài
    setIsShufflingCompleted(false); // Đánh dấu chưa hoàn tất xào bài

    // Hàm sẽ thực hiện một lần "xào bài"
    const shuffleOnce = () => {
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

  // Hàm trải các lá bài
  const spreadCardAnimation = () => {
    setAnimationStarted(true);
    let positions = Array(77).fill(0);
    positions[1] = 10;
    positions[2] = 20;
    for (let i = 3; i < 81; i++) {
      positions[i] = 20;
    }

    setCardPositions(positions);
    setIsCardVisible(true);
    const interval = setInterval(() => {
      let updatedPositions = [...positions];
      // Tăng dần vị trí của các lá bài từ 3 đến 77
      for (let i = 3; i < 81; i++) {
        updatedPositions[i] += (i-2) * 10; // Đặt các giá trị tăng dần từ vị trí 3 đến 77
      }

      setCardPositions(updatedPositions);

      if (updatedPositions[77] >= 770) {
        clearInterval(interval);
        setIsSpreadCompleted(true);
      }
    }, 400); // Điều chỉnh tốc độ animation
  };

  useEffect(() => {
    if (selectedTheme !== "CHỌN CHỦ ĐỀ") {
      setShowProcessCard(true);
      setShuffleButtonLeft('37%'); // Đặt lại vị trí của nút "XÀO BÀI"
      setListCardLeft('37%'); // Đặt lại vị trí của listCard
      setButtonLabel("XÀO BÀI"); // Cập nhật label nút về "XÀO BÀI"
      setIsShufflingCompleted(false);
      startCardAnimation();
      setIsSpreadCompleted(false);
      setHiddenCards([]);
    }
  }, [selectedTheme]);


  return (
    <div className={styles.container}>
      <div className={styles.containerWelcome}>
        {/* Navbar */}
        <nav className={styles.navbar}>
          <a href="#" className={styles.logo}>
            <img src="/logo.png" alt="Logo" className={styles.logoImage} />
            TAROCITOPIA
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
            AROCITOPIA
          </h1>
          <h1 className={styles.title}>
            <span className={styles.westmins}>T</span>
            AROCITOPIA
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
                <div className={styles.shuffleButton} style={{ left: `${shuffleButtonLeft}` }}>
                  <button onClick={handleShuffleClick} disabled={isShuffling || isSpreadCompleted}>
                    {isShufflingCompleted ? "TRẢI BÀI" : (isShuffling ? "ĐANG XÀO BÀI..." : buttonLabel)}
                  </button>
                </div>

                <div className={styles.listCard} style={{ left: `${listCardLeft}` }}>
                  <div className={styles.card} style={{ left: `${cardPositions[0]}px`, zIndex: 1, display: isSpreadCompleted && hiddenCards.includes(0) ? 'none' : 'block' }} onClick={() => handleCardClick(0)}>
                    <img src="card.png" alt="Card" />
                  </div>
                  <div className={styles.card} style={{ left: `${cardPositions[1]}px`, zIndex: 2, transform: `translate(${positionCard2Animation[0]}px, ${positionCard2Animation[1]}px)`, display: isSpreadCompleted && hiddenCards.includes(1) ? 'none' : 'block', }} onClick={() => handleCardClick(1)}>
                    <img src="card.png" alt="Card" />
                  </div>
                  <div 
                    className={`${styles.card}`} 
                    style={{ 
                      left: `${cardPositions[2]}px`, 
                      transform: `translate(${positionCard3Animation[0]}px, ${positionCard3Animation[1]}px)`,
                      zIndex: zIndexCard3Animation,
                      display: isSpreadCompleted && hiddenCards.includes(2) ? 'none' : 'block', 
                    }}
                    onClick={() => handleCardClick(2)}
                  >
                    <img src="card.png" alt="Card" />
                  </div>

                  {/* Thêm 75 lá bài vào sau khi xào xong */}
                  {isCardVisible && cardPositions.slice(3).map((position, index: number) => (
                    <div
                      key={index + 3} // Dùng key bắt đầu từ 3 để tránh trùng với 3 lá bài ban đầu
                      className={styles.card}
                      style={{ left: `${position}px`, zIndex: `${index + 4}`, transition: 'left 0.3s ease', display: isSpreadCompleted && hiddenCards.includes(index + 3) ? 'none' : 'block' }}
                      onClick={() => handleCardClick(index + 3)}
                    >
                      <img src="card.png" alt={`Card ${index + 3}`} />
                    </div>
                  ))}
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
