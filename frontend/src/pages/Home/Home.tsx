import React, { useState, useEffect, useRef } from 'react';
import styles from './Home.module.css';

const Home = () => {
  const [selectedDeck, setSelectedDeck] = useState("CHỌN BỘ BÀI");
  const [selectedTheme, setSelectedTheme] = useState("CHỌN CHỦ ĐỀ");
  const [isDeckOpen, setIsDeckOpen] = useState(false); // Trạng thái mở/đóng dropdown bộ bài
  const [isThemeOpen, setIsThemeOpen] = useState(false); // Trạng thái mở/đóng dropdown chủ đề
  const deckDropdownRef = useRef<HTMLDivElement>(null); // Chỉ định kiểu cho dropdown bộ bài
  const themeDropdownRef = useRef<HTMLDivElement>(null); // Chỉ định kiểu cho dropdown chủ đề
  const [showProcessCard, setShowProcessCard] = useState(false);
  const handleDeckSelect = (value: string) => {
    setSelectedDeck(value);
    setIsDeckOpen(false); // Đóng dropdown bộ bài sau khi chọn
  };

  const handleThemeSelect = (value: string) => {
    setSelectedTheme(value);
    setIsThemeOpen(false); // Đóng dropdown chủ đề sau khi chọn
  };

  const toggleDeckDropdown = () => {
    setIsDeckOpen(!isDeckOpen); // Đổi trạng thái dropdown bộ bài
  };

  const toggleThemeDropdown = () => {
    setIsThemeOpen(!isThemeOpen); // Đổi trạng thái dropdown chủ đề
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      (deckDropdownRef.current && !deckDropdownRef.current.contains(event.target as Node)) &&
      (themeDropdownRef.current && !themeDropdownRef.current.contains(event.target as Node))
    ) {
      setIsDeckOpen(false); // Đóng dropdown bộ bài khi click ra ngoài
      setIsThemeOpen(false); // Đóng dropdown chủ đề khi click ra ngoài
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside); // Lắng nghe sự kiện click ra ngoài
    return () => {
      document.removeEventListener('click', handleClickOutside); // Hủy sự kiện khi component unmount
    };
  }, []);

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

          {/* Dropdown Bộ Bài */}
          <div className={styles.chosenButton} ref={deckDropdownRef}>
            <div className={styles.dropdown}>
              <button className={styles.dropdownButton} onClick={toggleDeckDropdown}>
                {selectedDeck}
                <img 
                  src="/iconArrowDown.png" 
                  alt="Down Arrow" 
                  className={`${styles.arrowIcon} ${isDeckOpen ? styles.rotate : ''}`} 
                />
              </button>
              {isDeckOpen && (
                <ul className={styles.dropdownMenu}>
                  <li onClick={() => handleDeckSelect("RIDER WAITE")}>RIDER WAITE</li>
                  <li onClick={() => handleDeckSelect("SHADOWSCAPES")}>SHADOWSCAPES</li>
                  <li onClick={() => handleDeckSelect("WILDWOOD")}>WILDWOOD</li>
                  <li onClick={() => handleDeckSelect("DEVIANT MOON")}>DEVIANT MOON</li>
                </ul>
              )}
            </div>
          </div>

          {/* Dropdown Chủ Đề */}
          <div className={`${styles.chosenButton} ${styles.chosenSecondButton}`} ref={themeDropdownRef}>
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
          {selectedDeck !== "CHỌN BỘ BÀI" && selectedTheme !== "CHỌN CHỦ ĐỀ" && (
            <div className={`${styles.processChosenCard} ${showProcessCard ? styles.show : ''}`}>
              <h2 className={styles.smallTitle}>
                HÃY CHỌN LÁ BÀI CỦA BẠN
              </h2>
              <div className={styles.shuffleListCard}>
                <div className={styles.shuffleButton}>
                  <button>XÀO BÀI</button>
                </div>

                <div className={styles.listCard}>
                  
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
