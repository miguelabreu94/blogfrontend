import React, { useState } from "react";
import { Button, Form, Input, Label } from "reactstrap";


const EditPost = ({ post, onPostUpdated, onCancelEdit  }) => {
    const [title, setTitle] = useState(post.title);
    const [content, setContent] = useState(post.content);
  
    const handleUpdatePost = async (event) => {
      event.preventDefault();
      const token = localStorage.getItem("token");
  
      try {
        const response = await fetch(`http://localhost:8080/posts/${post.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title, content, imageName: post.imageName }),
        });
  
        if (response.ok) {
          const updatedPost = await response.json();
          onPostUpdated({... post, ...updatedPost});
        } else {
          console.error("Failed to update post");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    const handleCancelEdit = () => {
      // Reset title and content to original values from post object
      setTitle(post.title);
      setContent(post.content);
  
      // Optionally, you can pass this callback to notify the parent component
      onCancelEdit();
    };
  
    return (
      <Form onSubmit={handleUpdatePost}>
        <div className="my-3">
          <Label for="title">Title</Label>
          <Input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
          />
        </div>
        <div className="my-3">
          <Label for="content">Content</Label>
          <Input
            type="textarea"
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Content"
          />
        </div>
        <Button type="submit" color="primary">Update Post</Button>
        <Button type="delete" onClick={handleCancelEdit}>Cancel</Button>
      </Form>
    );
  };
  
  export default EditPost;