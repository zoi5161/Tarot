import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import Predict from './pages/Predict/Predict';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Predict" element={<Predict />} />
      </Routes>
    </Router>
  );
};

export default App;