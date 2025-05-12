import React, { useState } from 'react';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  name: string;
  nameEn: string;
  description: string;
  price: number;
  imageSrc: string;
  stock: number;
  quantity: number;
  onAddToCart: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ name, nameEn, description, price, imageSrc, stock, quantity, onAddToCart }) => {
  const [showPopup, setShowPopup] = useState(false); // State to control the popup visibility

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('vi-VN') + ' VNĐ';
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (stock > 0) {
      onAddToCart();
    }
  };

  const openPopup = () => {
    setShowPopup(true);
  };

  const closePopup = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowPopup(false);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowPopup(false);
  };

  return (
    <div className={styles.card} onClick={openPopup}> {/* Open popup when clicking on the card */}
      <img src={`http://localhost:1234${imageSrc}`} alt={name} className={styles.image} />
      <div className={styles.cardDetails}>
        <h3 className={styles.productName}>{name}</h3>
        <p className={styles.productNameEn}>{nameEn}</p>
        <p className={styles.productPrice}>{formatCurrency(price)}</p>
        <button
          className={styles.addToCartButton}
          onClick={handleAddToCart}
          disabled={stock <= 0 || quantity >= stock} // Disable button if stock is 0 or less
        >
          Thêm vào giỏ
        </button>
        {stock <= 0 && <p className={styles.outOfStock}>Hết hàng</p>} {/* Show out-of-stock message */}
      </div>

      {/* Popup Section */}
      {showPopup && (
        <div className={styles.popupOverlay} onClick={handleOverlayClick}>
          <div className={styles.popupContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={closePopup}>X</button>
            <img src={`http://localhost:1234${imageSrc}`} alt={name} className={styles.popupImage} />
            <div className={styles.popupDetails}>
              <div className={styles.popupHeader}>
                <h3 className={styles.popupProductName}>{name}</h3>
                <p className={styles.popupProductNameEn}>"{nameEn}"</p>
              </div>
              <div className={styles.popupDescriptionContainer}>
                <p className={styles.popupDescription}>Mô tả: <br/>{description}</p>
              </div>
              <div className={styles.popupFooter}>
                <p className={styles.popupPrice}>Giá: {formatCurrency(price)}</p>
                <p className={styles.popupStock}>Tồn kho: {stock} cái</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
