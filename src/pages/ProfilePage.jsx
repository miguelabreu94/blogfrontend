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

  const handlePromoteToMod = async (username) => {
    try {
      const response = await fetch(
        `http://localhost:8080/admin/promotemod/${username}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        alert(`User ${username} promoted to moderator successfully`);
        // Refresh the user list after promotion
        fetchUsersWithUserRole();
      } else {
        const responseData = await response.json();
        alert(responseData.message || "Failed to promote user to moderator");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while promoting user to moderator");
    }
  };

  const handleDemoteToUser = async (username) => {
    try {
      const response = await fetch(
        `http://localhost:8080/admin/demote/${username}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        alert(`User ${username} demoted to regular user successfully`);
        // Refresh the user list after demotion
        fetchUsersWithUserRole();
      } else {
        const responseData = await response.json();
        alert(responseData.message || "Failed to demote user to regular user");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while demoting user to regular user");
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
              <table className="user-table">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Permissions</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {usersWithUserRole.map((user) => (
                    <tr key={user.id} className="user-list">
                      <td>{user.username}</td>
                      <td>
                        {user.role === "USER"
                          ? "User"
                          : user.role === "MOD"
                          ? "Moderator"
                          : "Admin"}
                      </td>
                      <td>
                        {user.role === "USER" ? (
                          <>
                            <button
                              className="button-promote-admin"
                              onClick={() => handlePromoteToAdmin(user.username)}
                            >
                              Promote to Admin
                            </button>
                            <button
                              className="button-promote-mod"
                              onClick={() => handlePromoteToMod(user.username)}
                            >
                              Promote to Mod
                            </button>
                          </>
                        ) : user.role === "MOD" ? (
                          <>
                            <button
                              className="button-promote-admin"
                              onClick={() => handlePromoteToAdmin(user.username)}
                            >
                              Promote to Admin
                            </button>
                            <button
                              className="button-demote-user"
                              onClick={() => handleDemoteToUser(user.username)}
                            >
                              Demote to User
                            </button>
                          </>
                        ) : (
                          <span></span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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