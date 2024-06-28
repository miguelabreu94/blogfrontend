import React, { useEffect, useState } from 'react';
import { useParams, useNavigate  } from 'react-router-dom';
import { slugify } from '../components/utils'; // Import the slugify function
import PostCard from '../components/PostCard';

const PostPage = () => {
    const { id, slug } = useParams();
    const navigate  = useNavigate();
    const [post, setPost] = useState(null);
    const [postToEdit, setPostToEdit] = useState(null); // State to keep track of the post being edited
    const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Fetch the post data based on the ID
    fetch(`http://localhost:8080/posts/${id}`) // Correct URL interpolation
      .then(response => response.json())
      .then(data => setPost(data))
      .catch(error => console.error('Error fetching post:', error));
  }, [id]);

  useEffect(() => {
    if (post) {
      const generatedSlug = slugify(post.title);
      if (slug !== generatedSlug) {
        // Redirect to the correct URL
        navigate(`/post/${id}/${generatedSlug}`,{ replace: true });
      }
    }
  }, [post, slug, id, navigate]);

  if (!post) {
    return <div>Loading...</div>;
  }

  // Optionally, check if the slug matches the post title
  const generatedSlug = slugify(post.title);
  if (slug !== generatedSlug) {
    // Handle slug mismatch (redirect to correct URL or show an error)
    console.warn('Slug does not match the post title. You might want to redirect to the correct URL.');
  }


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

  return (
    <div>
      <PostCard
            key={post.id}
            post={post}
            onDeletePost={handleDeletePost}
            onEditPost={handleEditPost}
          />
    </div>
  );
};

export default PostPage;