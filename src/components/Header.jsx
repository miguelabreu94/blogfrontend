import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import "../css/Header.css"
import {logout} from "./utils"

const Header = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState("");


  useEffect(() => {
    const fetchUserFromLocalStorage = () => {
      const storedUser = localStorage.getItem("user");
      const storedRole = localStorage.getItem("role");

      if (storedUser) {
        const userObject = JSON.parse(storedUser); // Parse JSON string to object
        setUser(userObject);
        setIsAdmin(storedRole === "ADMIN"); // Set isAdmin based on the role
      }
    };

    fetchUserFromLocalStorage();
  }, []);


  const navigate = useNavigate();

  const handleLogout = () => {
    logout(navigate);
    setUser(null);
    setIsAdmin(false);
  };

  const userInfo = JSON.parse(localStorage.getItem('user'));

  return (
    <header>
      <nav>
        <div className="nav-left">
          <ul>
            <li>
              <Link to="/dashboard">Home</Link>
            </li>
            <li>
              <Link to="/profile">My profile</Link>
            </li>

              <li>
              {isAdmin && <Link to ="/add-post">Create Post</Link>} 
              </li> 
          </ul>
        </div>
        <div className="nav-right">
          <ul>
          {userInfo && (
              <li>
                <span className="username-display">Welcome, {userInfo.username}</span>
              </li>
            )}
            <li>
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
