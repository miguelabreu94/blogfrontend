import React, { useEffect, useState } from "react";
import "../css/Dashboard.css"
import PostCard from "../components/PostCard"; // Correct import statement

const Dashboard = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch("http://localhost:8080/posts", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          },
        });

        const responseData = await response.json();
        setPosts(responseData.content);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <main>
        {
            posts.map((post) => (
                <PostCard key={post.id} post={post}/>
            ))
        }  
    </main>
  );
};

export default Dashboard;
