// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';  // Bạn có thể tùy chỉnh hoặc tạo tệp index.css
import App from './App';  // Import component App chính của bạn

// Render ứng dụng vào phần tử có id là "root" trong index.html
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);