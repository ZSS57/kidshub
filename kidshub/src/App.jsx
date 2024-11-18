
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomeFeed from './components/HomeFeed';
import CreatePost from './components/CreatePost';
import PostDetail from './components/PostDetail';
import './App.css';


function App() {
  return (
    <Router>
      <nav className="navbar">
        <img src='./logo.jpg'  alt="KidsHub Logo" className="logo" />

        <span className="navbar-brand">Kidshub</span>
      
        <div className="navbar-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/create" className="nav-link">Create Post</Link>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<HomeFeed />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/post/:id" element={<PostDetail />} />
      </Routes>
    </Router>
  );
}

export default App;