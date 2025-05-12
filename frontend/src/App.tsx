import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home/Home';
import Predict from './pages/Predict/Predict';
import Blog from './pages/Blog/Blog';
import Shop from './pages/Shop/Shop';
import BlogDetail from './components/BlogDetail/BlogDetail';
import Login from './pages/Admin/Login'
import Manage from './pages/Admin/Manage';
import AboutUs from './pages/AboutUs/AboutUs';

const App = () => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Predict" element={<Predict />} />
        <Route path="/Shop" element={<Shop />} />
        <Route path="/Blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="/AboutUs" element={<AboutUs />} />
        <Route path="/Manage" element={isLoggedIn ? <Manage /> : <Navigate to="/Admin" />} />
        <Route path="/Admin" element={isLoggedIn ? <Manage /> : <Login />} />
      </Routes>
    </Router>
  );
};

export default App;