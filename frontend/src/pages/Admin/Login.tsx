import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Để sử dụng chức năng điều hướng
import styles from './Login.module.css';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // Trạng thái để lưu thông báo lỗi
  const navigate = useNavigate(); // Hàm để điều hướng sang trang khác

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
      navigate('/Manage');
    }
  }, [navigate]);

  const handleLogin = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setErrorMessage('');
        
        const expiryTime = new Date().getTime() + 60 * 60 * 1000; // Thời gian hết hạn là 1 tiếng (60 phút)
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('expiryTime', expiryTime.toString());
        
        
        window.location.reload();
      } else {
        setErrorMessage(data.message || 'Đăng nhập thất bại');
      }
    } catch (error) {
      setErrorMessage('Có lỗi xảy ra khi đăng nhập');
    }
  };

  const handleSignUp = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Đăng ký thành công');
      } else {
        setErrorMessage(data.message || 'Đăng ký thất bại');
      }
    } catch (error) {
      setErrorMessage('Có lỗi xảy ra khi đăng ký');
    }
  };


  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h2>Đăng nhập</h2>
        <input 
          type="text" 
          placeholder="Username" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          className={styles.inputLogin}
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          className={styles.inputLogin}
        />
        {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
        <button onClick={handleLogin} className={styles.loginButton}>Đăng nhập</button>
        {/* <button onClick={handleSignUp} className={styles.loginButton}>Đăng Ký</button> */}
      </div>
    </div>
  );
};

export default Login;
