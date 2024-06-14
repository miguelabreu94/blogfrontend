import React, { useEffect, useState } from "react";
import "../css/Dashboard.css";
import PostCard from "../components/PostCard";
import AddPost from "../components/AddPost";

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState("");

  useEffect(() => {
    const fetchUserFromLocalStorage = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser)); // Parse JSON string to object
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

  return (
    <main>
      {user && <AddPost onPostAdded={handlePostAdded} user={user} />}
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </main>
  );
};

export default Dashboard;



