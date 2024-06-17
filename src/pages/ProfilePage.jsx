import React, { useEffect, useState } from "react";
import "../css/ProfilePage.css";

const ProfilePage = () => {
  const [userInfo, setUserInfo] = useState({
    id: "",
    username: "",
    fullname: "",
    bio: "",
    role: "",
  });
  const [usersWithUserRole, setUsersWithUserRole] = useState([]);
  const [error, setError] = useState(null);
  const [showUserList, setShowUserList] = useState(false); // State to control visibility of user list

  useEffect(() => {
    // Retrieve the user information from local storage
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUserInfo({
        id: user.id,
        username: user.username,
        fullname: user.pessoa.fullName,
        bio: user.pessoa.bio,
        role: localStorage.getItem("role"),
      });
    }

    if (user && user.role === "ADMIN") {
      fetchUsersWithUserRole();
    }
  }, []);

  const fetchUsersWithUserRole = async () => {
    try {
      const response = await fetch("http://localhost:8080/user", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsersWithUserRole(data);
      } else {
        console.error("Failed to fetch users with user role");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to fetch users with user role");
    }
  };

  const handlePromoteToAdmin = async (username) => {
    try {
      const response = await fetch(
        `http://localhost:8080/admin/promote/${username}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        alert(`User ${username} promoted to admin successfully`);
        // Refresh the user list after promotion
        fetchUsersWithUserRole();
      } else {
        const responseData = await response.json();
        alert(responseData.message || "Failed to promote user to admin");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while promoting user to admin");
    }
  };

  const toggleUserList = () => {
    setShowUserList(!showUserList);
    if (!showUserList) {
      fetchUsersWithUserRole();
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2 className="profile-title">My Profile</h2>
      </div>
      <div className="profile-details">
        <div className="profile-detail">
          <strong>Username:</strong> <span>{userInfo.username}</span>
        </div>
        <div className="profile-detail">
          <strong>Fullname:</strong> <span>{userInfo.fullname}</span>
        </div>
        <div className="profile-detail">
          <strong>Bio:</strong> <span>{userInfo.bio}</span>
        </div>
        {error ? (
          <p>{error}</p>
        ) : (
          showUserList && (
            <div>
              <h3 className="title-user-role">Users:</h3>
              <ul>
                {usersWithUserRole.map((user) => (
                  <li className="user-list" key={user.id}>
                    {user.username}
                    {user.role === "USER" ? (
                      <button
                        className="button-promote-admin"
                        onClick={() => handlePromoteToAdmin(user.username)}
                      >
                        Promote to Admin
                      </button>
                    ) : (
                      <span> (Admin)</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )
        )}
      </div>
      {/* Promote User Button */}
      {userInfo.role === "ADMIN" && (
        <button className="button-hide-userlist" onClick={toggleUserList}>
          {showUserList ? "Hide User List" : "Promote a User"}
        </button>
      )}
    </div>
  );
};

export default ProfilePage;
