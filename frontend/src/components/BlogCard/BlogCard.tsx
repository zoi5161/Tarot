import React from 'react';
import styles from './BlogCard.module.css';

interface BlogCardProps {
  title: string;
  shortDescription: string;
  content: string;
  date: string;
  src: string;
  onClick: () => void;
}

const BlogCard: React.FC<BlogCardProps> = ({ title, shortDescription, content, date, src, onClick }) => {
  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.image}>
        <img src={src} alt="Blog" className={styles.imageContent} />
      </div>
      <div className={styles.infor}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.description}>{shortDescription}</p>
        <span className={styles.date}>{date}</span>
      </div>
    </div>
  );
};

export default BlogCard;
