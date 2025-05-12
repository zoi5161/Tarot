import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import Predict from './pages/Predict/Predict';
import Blog from './pages/Blog/Blog';
import Shop from './pages/Shop/Shop';
import BlogDetail from './components/BlogDetail/BlogDetail';
import Login from './pages/Admin/Login'
import Manage from './pages/Admin/Manage';
import AboutUs from './pages/AboutUs/AboutUs';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Predict" element={<Predict />} />
        <Route path="/Shop" element={<Shop />} />
        <Route path="/Blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="/AboutUs" element={<AboutUs />} />
        <Route path="/Manage" element={<Manage />} />
        <Route path="/Admin" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;