import React from 'react';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  name: string;
  description: string;
  price: number;
  imageSrc: string;
  onAddToCart: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ name, description, price, imageSrc, onAddToCart }) => {
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('vi-VN') + ' VNĐ';
  };
  return (
    <div className={styles.card}>
      <img src={imageSrc} alt={name} className={styles.image} />
      <div className={styles.cardDetails}>
        <h3 className={styles.productName}>{name}</h3>
        <p className={styles.productDescription}>{description}</p>
        <p className={styles.productPrice}>{formatCurrency(price)}</p>
        <button className={styles.addToCartButton} onClick={onAddToCart}>
          Thêm vào giỏ
        </button>
      </div>
    </div>
  );
};

export default ProductCard;