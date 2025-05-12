import React, { useState, useEffect, useRef } from 'react';
import styles from './Predict.module.css';
import Navbar from '../../components/NavBar/Navbar';
import FloatingParticles from '../../components/FloatingParticles/FloatingParticles';
import Footer from '../../components/Footer/Footer';
import axios from 'axios';

interface Card {
  src: string;
  DescriptionFamily: string;
  DescriptionStudy: string;
  DescriptionLove: string;
}

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
  const [isShuffling, setIsShuffling] = useState(false);
  const [isShufflingCompleted, setIsShufflingCompleted] = useState(false);
  const [isCardVisible, setIsCardVisible] = useState(false);
  const [shuffleButtonLeft, setShuffleButtonLeft] = useState('37%');
  const [listCardLeft, setListCardLeft] = useState('37%');
  const [buttonLabel, setButtonLabel] = useState("XÀO BÀI");
  const [isSpreadCompleted, setIsSpreadCompleted] = useState(false);
  const [hiddenCards, setHiddenCards] = useState<number[]>([]);
  const [cardImages, setCardImages] = useState(['quesCard.jpg', 'quesCard.jpg', 'quesCard.jpg']);
  const [selectedCards, setSelectedCards] = useState<Card[]>([]);
  const [isMeaningButtonClicked, setIsMeaningButtonClicked] = useState(false);
  const [finalPrompt, setFinalPrompt] = useState('Bạn hãy đưa ra ý nghĩa chung khoảng 200-300 chữ cho 3 lá bài tarot tôi vừa bóc được. Tuyệt đối trong ý nghĩa chung không được nhắc đơn lẻ về 3 lá bài. Không cần dấu gạch đầu dòng và cũng không được dùng dấu -. Không cần câu dẫn gì hết, chỉ cần trả lời ý nghĩa chung thôi. Mỗi ý nghĩa cách nhau 1 dấu "-":');
  const [selectedCardIndexes, setSelectedCardIndexes] = useState<number[]>([]);
  const [responseText, setResponseText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const themeDropdownRef = useRef<HTMLDivElement>(null);
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0'); // Đảm bảo ngày có 2 chữ số
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0, nên cộng thêm 1
  const year = today.getFullYear();

  const formattedDate = `${day}-${month}-${year}`;


  const fetchCardData = async () => {
    const response = await fetch('/Information.txt');
    
    if (!response.ok) {
      console.error('Error fetching file:', response.statusText);
      return;
    }
    
    const text = await response.text();
    
    const cardLines = text.split('\n').filter(line => line.trim() !== '');
    
    const cardsData = cardLines.map(line => {
      const [
        src,
        DescriptionFamily,
        DescriptionStudy,
        DescriptionLove,
      ] = line.split('|');

      return {
        src,
        DescriptionFamily,
        DescriptionStudy,
        DescriptionLove,
      };
    });

    return cardsData; // Return the fetched card data
  };

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

  const handleCardClick = async (index: number) => {
    if (hiddenCards.length < 3 && !hiddenCards.includes(index) && isSpreadCompleted) {
      const newHiddenCards = [...hiddenCards, index];
      setHiddenCards(newHiddenCards);

      const randomCardIndex = await getUniqueRandomCardIndex(); // Lấy số ngẫu nhiên không trùng
      if (randomCardIndex === -1) {
        console.log('Không còn lá bài nào để chọn.');
        return;
      }

      const cardsData = await fetchCardData(); // Lấy dữ liệu các lá bài
      if (!cardsData) {
        console.error('Cards data is undefined');
        return;
      }

      const selectedCard = cardsData[randomCardIndex]; // Chọn lá bài từ index ngẫu nhiên

      // Thêm lá bài đã chọn vào state
      setSelectedCards(prevCards => [
        ...prevCards,
        selectedCard
      ]);

      // Cập nhật hình ảnh của lá bài đã chọn
      const newCardImages = [...cardImages];
      const nextEmptyIndex = newCardImages.findIndex(image => image === 'quesCard.jpg');
      if (nextEmptyIndex !== -1) {
        newCardImages[nextEmptyIndex] = `cards/card${randomCardIndex + 1}.jpg`; // Cập nhật ảnh
        setCardImages(newCardImages);
      }

      // Gọi lại hàm generateFinalPrompt sau khi thay đổi cardImages
      generateFinalPrompt(selectedTheme);
    }
  };

const getUniqueRandomCardIndex = async () => {
  const cardsData = await fetchCardData();
  if (!cardsData || cardsData.length === 0) return -1;

  // Create an array to store excluded card indexes
  let excludedIndexes = [...selectedCardIndexes];

  // Add excluded indexes n and n+78 for each selected card
  selectedCardIndexes.forEach(index => {
    excludedIndexes.push(index);        // Exclude the nth card
    if (index + 78 < cardsData.length) {
      excludedIndexes.push(index + 78); // Exclude the nth+78 card
    }
  });

  // Generate a random number and check for duplicates
  let randomCardIndex: number;  // Explicitly define the type of randomCardIndex as 'number'
  do {
    randomCardIndex = Math.floor(Math.random() * cardsData.length); // Generate a random number
  } while (excludedIndexes.includes(randomCardIndex)); // Check if the number is already excluded

  // Update the selectedCardIndexes state with the selected index
  setSelectedCardIndexes(prevIndexes => [...prevIndexes, randomCardIndex]);

  return randomCardIndex; // Return the non-duplicate index
};


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

  const generateFinalPrompt = (theme: string) => {
    let prompt = 'Bạn hãy đưa ra ý nghĩa chung khoảng 200-300 chữ cho 3 lá bài tarot tôi vừa bóc được. Tuyệt đối trong ý nghĩa chung không được nhắc đơn lẻ về 3 lá bài. Không cần dấu gạch đầu dòng và cũng không được dùng dấu -. Không cần câu dẫn gì hết, chỉ cần trả lời ý nghĩa chung thôi. Mỗi ý nghĩa cách nhau 1 dấu "-":';
    
    // Loop through selected cards and create the prompt based on selected theme
    selectedCards.forEach((card) => {
      let description = '';
      
      switch (theme) {
        case 'GIA ĐÌNH':
          description = card.DescriptionFamily;
          break;
        case 'HỌC TẬP':
          description = card.DescriptionStudy;
          break;
        case 'TÌNH CẢM':
          description = card.DescriptionLove;
          break;
        default:
          break;
      }

      if (description) {
        prompt += description + '-';
      }
      console.log('Final Prompt:', finalPrompt);
    });

    // Set the finalPrompt state with the result
    setFinalPrompt(prompt.trim()); // This will update the finalPrompt and trigger re-render
  };

  const handleMeaningButtonClick = async () => {
    if (!isMeaningButtonClicked && hiddenCards.length === 3) {
      generateFinalPrompt(selectedTheme);
      setIsMeaningButtonClicked(true);
      setIsLoading(true); 

      try {
        // Gửi finalPrompt đến API backend
        const response = await axios.post('http://localhost:1234/api/ask-gemini', {
          prompt: finalPrompt,
        });

        // Log câu trả lời từ Gemini API
        console.log('Câu trả lời từ Gemini:', response.data.answer);
        setResponseText(response.data.answer);
        setIsLoading(false);
      } catch (error) {
        console.error('Lỗi khi lấy câu trả lời từ Gemini:', error);
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (selectedTheme !== "CHỌN CHỦ ĐỀ") {
      setFinalPrompt('Bạn hãy đưa ra ý nghĩa chung ít nhất 200 chữ và nhiều nhất 300 chữ cho 3 lá bài tarot tôi vừa bóc được. Nhớ xuống dòng sau 1 đoạn nào đó.  Không được nhắc lại ý nghĩa tôi đã đưa, tuyệt đối trong câu trả lời không được có các câu kiểu "Lá đầu tiên có ý nghĩa", "Lá bài thứ 2", "Lá bài thứ 3" gì đó. Không cần dấu gạch đầu dòng và cũng không được dùng dấu -. Không cần câu dẫn gì hết, chỉ cần trả lời ý nghĩa chung thôi. Mỗi ý nghĩa cách nhau 1 dấu "-":');
      setShowProcessCard(true);
      setShuffleButtonLeft('37%');
      setListCardLeft('37%');
      setButtonLabel("XÀO BÀI");
      setIsShufflingCompleted(false);
      startCardAnimation();
      setIsSpreadCompleted(false);
      setHiddenCards([]);
      setCardImages(['quesCard.jpg', 'quesCard.jpg', 'quesCard.jpg']);
      setIsMeaningButtonClicked(false);
      setSelectedCards([]);
    }
  }, [selectedTheme]);

  useEffect(() => {
    console.log(selectedCards);
  }, [selectedCards]);

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    console.log('Updated Final Prompt:', finalPrompt);
  }, [finalPrompt]);

  useEffect(() => {
  if (showProcessCard) {
    // Cuộn trang xuống phần tử khi showProcessCard trở thành true
    const element = document.getElementById('processChosenCard');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    }
  }, [showProcessCard]);

  useEffect(() => {
    if (isMeaningButtonClicked) {
      // Cuộn trang xuống phần tử khi isMeaningButtonClicked trở thành true
      const element = document.getElementById('displayMeaning');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [isMeaningButtonClicked]);

  return (
    <div className={styles.container}>
      <div className={styles.containerWelcome}>
        {/* Navbar */}
        <Navbar />
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
                  <li onClick={() => handleThemeSelect("GIA ĐÌNH")}>GIA ĐÌNH</li>
                  <li onClick={() => handleThemeSelect("HỌC TẬP")}>HỌC TẬP</li>
                  <li onClick={() => handleThemeSelect("TÌNH CẢM")}>TÌNH CẢM</li>
                </ul>
              )}
            </div>
          </div>


        </div>
      </div>
      <div className={styles.containerOurInfor}>
        <FloatingParticles count={150} />
          {/* Chỉ hiển thị khi cả bộ bài và chủ đề đã được chọn */}
          {selectedTheme !== "CHỌN CHỦ ĐỀ" && (
            <div id="processChosenCard" className={`${styles.processChosenCard} ${showProcessCard ? styles.show : ''}`}>
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
                    <img src="card.jpg" alt="Card" />
                  </div>
                  <div className={styles.card} style={{ left: `${cardPositions[1]}px`, zIndex: 2, transform: `translate(${positionCard2Animation[0]}px, ${positionCard2Animation[1]}px)`, display: isSpreadCompleted && hiddenCards.includes(1) ? 'none' : 'block', }} onClick={() => handleCardClick(1)}>
                    <img src="card.jpg" alt="Card" />
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
                    <img src="card.jpg" alt="Card" />
                  </div>

                  {/* Thêm 75 lá bài vào sau khi xào xong */}
                  {isCardVisible && cardPositions.slice(3).map((position, index: number) => (
                    <div
                      key={index + 3} // Dùng key bắt đầu từ 3 để tránh trùng với 3 lá bài ban đầu
                      className={styles.card}
                      style={{ left: `${position}px`, zIndex: `${index + 4}`, transition: 'left 0.3s ease', display: isSpreadCompleted && hiddenCards.includes(index + 3) ? 'none' : 'block' }}
                      onClick={() => handleCardClick(index + 3)}
                    >
                      <img src="card.jpg" alt={`Card ${index + 3}`} />
                    </div>
                  ))}
                </div>
              </div>


                <div className={styles.threeCards}>
                  <div className={styles.bigCard}>
                    <img src={isSpreadCompleted && cardImages[0] ? cardImages[0] : 'quesCard.jpg'}  alt="Card 1" />
                    BẢN THÂN
                  </div>
                  <div className={styles.bigCard}>
                    <img src={isSpreadCompleted && cardImages[0] ? cardImages[1] : 'quesCard.jpg'}  alt="Card 2" />
                    HOÀN CẢNH
                  </div>
                  <div className={styles.bigCard}>
                    <img src={isSpreadCompleted && cardImages[0] ? cardImages[2] : 'quesCard.jpg'}  alt="Card 3" />
                    THỬ THÁCH
                  </div>
                </div>

                <div className={styles.meaningButton} onClick={isSpreadCompleted ? handleMeaningButtonClick : undefined}>
                  <div className={styles.inMeaningButton}>
                      TIẾT LỘ Ý NGHĨA
                  </div>
                </div>

                {isMeaningButtonClicked && (
                    <div id="displayMeaning" className={styles.displayMeaning}>
                      <div className={styles.smallTitleDate}>QUẺ BÓI TAROT NGÀY 
                        <span className={styles.date}>{formattedDate}</span>
                      </div>

                      {/* Nếu đang tải, hiển thị thông báo chờ */}
                      {isLoading ? (
                        <div className={styles.loadingMessage}>
                          Các vì sao đang tìm câu trả lời cho bạn
                          <img 
                            src="loading.gif" // Đường dẫn đến GIF của bạn
                            alt="Loading..." 
                            className={styles.loadingGif}
                          />
                        </div>
                      ) : (
                        <div className={styles.meaningText}>
                          {responseText.split('\n').map((line, index) => (
                            <React.Fragment key={index}>
                              {line}
                              <br />
                            </React.Fragment>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
            </div>
          )}
      </div>
        <Footer />
    </div>
  );
};

export default Home;
