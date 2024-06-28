import React, { useEffect, useState } from "react";
import "../css/Dashboard.css";
import PostCard from "../components/PostCard";
import EditPost from "../components/EditPost";


const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [postToEdit, setPostToEdit] = useState(null); // State to keep track of the post being edited
  const [selectedCategory, setSelectedCategory] = useState(""); // State for selected category
  const [categories, setCategories] = useState([]);
  const [groupByCategory, setGroupByCategory] = useState(false); // State to control grouping by category


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
      setCategories(getUniqueCategories(responseData.content)); // Extract unique categories
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getUniqueCategories = (posts) => {
    const allCategories = posts.flatMap(post => post.categories);
    return [...new Set(allCategories)];
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

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleGroupByCategoryChange = (event) => {
    setGroupByCategory(event.target.checked);
  };

  const groupPostsByCategory = (posts) => {
    const groupedPosts = {};
    posts.forEach((post) => {
      post.categories.forEach((category) => {
        if (!groupedPosts[category]) {
          groupedPosts[category] = [];
        }
        groupedPosts[category].push(post);
      });
    });
    return groupedPosts;
  };

  const filteredPosts = selectedCategory
    ? posts.filter(post => post.categories.includes(selectedCategory))
    : posts;

  const groupedPosts = groupByCategory ? groupPostsByCategory(filteredPosts) : null;

  return (
    <main>
      {(
        <div className="category-filter">
          <label className="category-filter-text" htmlFor="category-select">Filter by Category: </label>
          <select
            id="category-select"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="">All</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      )}
      {isAdmin && (
        <div className="group-by-category">
        <label>
        <span>Group by Category (Admin)</span>
          <input
            type="checkbox"
            checked={groupByCategory}
            onChange={handleGroupByCategoryChange}
          />
        </label>
      </div>
      )}
{/*       {isAdmin && <AddPost onPostAdded={handlePostAdded} user={user} />} 
 */}      {postToEdit && (
        <EditPost post={postToEdit} onPostUpdated={handlePostUpdated} onCancelEdit={handleCancelEdit}/>
      )}
      {groupByCategory ? (
        Object.keys(groupedPosts).map((category) => (
          <section key={category} className="category-section">
            <h2 className="category-title">{category}</h2>
            {groupedPosts[category].map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onDeletePost={handleDeletePost}
                onEditPost={handleEditPost}
              />
            ))}
          </section>
        ))
      ) : (
        filteredPosts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onDeletePost={handleDeletePost}
            onEditPost={handleEditPost}
          />
        ))
      )}
    </main>
  );
};

export default Dashboard;