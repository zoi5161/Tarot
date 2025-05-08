import React from 'react';
import styles from './Home.module.css';

const Home = () => {
  return (
    <div className={styles.container}>
      {/* Navbar */}
      <nav className={styles.navbar}>
        <ul className={styles.navList}>
          <li className={styles.navItem}><a href="#">Home</a></li>
          <li className={styles.navItem}><a href="#">About</a></li>
          <li className={styles.navItem}><a href="#">Services</a></li>
          <li className={styles.navItem}><a href="#">Contact</a></li>
        </ul>
      </nav>

      {/* Content */}
      <div className={styles.banner}>
        <h1 className={styles.title}>Welcome to the Tarot World</h1>
      </div>
    </div>
  );
};

export default Home;