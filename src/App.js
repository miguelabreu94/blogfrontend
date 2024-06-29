import React from 'react';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import PostPage from './pages/PostPage';
import ProfilePage from "./pages/ProfilePage"
import ProtectedRoute from "./components/ProtectedRoute"
import AddPost from './components/AddPost';
import FavouritePosts from './pages/FavouritePosts';
import "../src/css/global-styles.css"

const App = () => {

  const [user, setUser] = useState(null); // Assuming user state is managed in App.js or fetched from localStorage

  // Example function to fetch user from localStorage or perform authentication
  const fetchUser = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // Handle case where user is not authenticated or session is expired
      // Redirect to login page or perform other actions
    }
  };

  // Example: Fetch user on component mount
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<ProtectedRoute element={Dashboard} />} />
        <Route path="/profile" element={<ProtectedRoute element={ProfilePage} />} />
        <Route path="/add-post" element={<ProtectedRoute element={() => <AddPost user={user} />} />} />
        <Route path="/" element={<LoginPage />} />
        <Route path="/post/:id/:slug" element={<PostPage />} /> {/* Updated Route */}
        <Route path="/favorite-posts" element={<FavouritePosts user = {user}/>} />
      </Routes>
    </Router>
  );
};

export default App;

