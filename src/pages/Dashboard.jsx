import React, { useEffect, useState } from "react";
import "../css/Dashboard.css";
import PostCard from "../components/PostCard";
import AddPost from "../components/AddPost";
import EditPost from "../components/EditPost";


const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [postToEdit, setPostToEdit] = useState(null); // State to keep track of the post being edited

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

  const handleEditPost = (post) => {
    setPostToEdit(post); // Set the post to be edited
  };

  const handlePostUpdated = (updatedPost) => {
    setPosts(posts.map((post) => (post.id === updatedPost.id ? updatedPost : post)));
    setPostToEdit(null); // Clear the post being edited
  };

  const handleCancelEdit = () => {
    setPostToEdit(null); // Clear the post being edited
  };

  return (
    <main>
      {isAdmin && <AddPost onPostAdded={handlePostAdded} user={user} />}
      {postToEdit && (
        <EditPost post={postToEdit} onPostUpdated={handlePostUpdated} onCancelEdit={handleCancelEdit}/>
      )}
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onDeletePost={handleDeletePost}
          onEditPost={handleEditPost}
        />
      ))}
    </main>
  );
};

export default Dashboard;



