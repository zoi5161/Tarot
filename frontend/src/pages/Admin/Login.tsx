import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Để sử dụng chức năng điều hướng
import styles from './Login.module.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // Trạng thái để lưu thông báo lỗi
  const navigate = useNavigate(); // Hàm để điều hướng sang trang khác

  // Hàm xử lý đăng nhập
  const handleLogin = () => {
    if (username === 'admin' && password === '123') {
      setErrorMessage(''); // Xóa thông báo lỗi nếu đăng nhập thành công
      navigate('/Manage'); // Điều hướng tới trang /Manage nếu username và password đúng
    } else {
      setErrorMessage('Sai tài khoản hoặc mật khẩu!'); // Hiển thị thông báo lỗi nếu thông tin sai
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
          className={styles.input}
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          className={styles.input}
        />
        {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
        <button onClick={handleLogin} className={styles.loginButton}>Đăng nhập</button>
      </div>
    </div>
  );
};

export default Login;
