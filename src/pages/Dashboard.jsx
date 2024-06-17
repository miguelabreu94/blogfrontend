import React, { useEffect, useState } from "react";
import "../css/Dashboard.css";
import PostCard from "../components/PostCard";
import AddPost from "../components/AddPost";

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);


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

  useEffect(() => {
    if (user) {
      console.log(user)
      fetchPosts();
    }
  }, [user]);

  const fetchPosts = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:8080/posts", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const responseData = await response.json();
      setPosts(responseData.content);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handlePostAdded = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  const handleDeletePost = async (postId) => {
    const token = localStorage.getItem("token");

    try {
      await fetch(`http://localhost:8080/posts/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPosts(posts.filter(post => post.id !== postId));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <main>
      {isAdmin && <AddPost onPostAdded={handlePostAdded} user={user} />}
      {posts.map((post) => (
        <PostCard key={post.id} post={post} onDeletePost={handleDeletePost} />
      ))}
    </main>
  );
};

export default Dashboard;



