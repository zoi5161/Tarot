import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import Predict from './pages/Predict/Predict';
import Blog from './pages/Blog/Blog';
import Shop from './pages/Shop/Shop';
import BlogDetail from './components/BlogDetail/BlogDetail';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Predict" element={<Predict />} />
        <Route path="/Shop" element={<Shop />} />
        <Route path="/Blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
      </Routes>
    </Router>
  );
};

export default App;