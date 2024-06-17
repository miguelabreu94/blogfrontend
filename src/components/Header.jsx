import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../css/Header.css"
import {logout} from "./utils"

const Header = () => {

  const navigate = useNavigate();

  const handleLogout = () => {
    logout(navigate);
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
