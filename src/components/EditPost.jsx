import React, { useState } from "react";
import { Button, Form, Input, Label } from "reactstrap";


const EditPost = ({ post, onPostUpdated, onCancelEdit  }) => {
    const [title, setTitle] = useState(post.title);
    const [content, setContent] = useState(post.content);
    const [imageName, setImageName] = useState(post.imageName);
  
    const handleUpdatePost = async (event) => {
      event.preventDefault();
      const token = localStorage.getItem("token");

      const updatedPost = {
        title,
        content,
        imageName,
      };
  
      try {
        const response = await fetch(`http://localhost:8080/posts/${post.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedPost),
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
      setImageName(post.imageName);

      // Optionally, you can pass this callback to notify the parent component
      onCancelEdit();
    };
  
    return (
      <Form onSubmit={handleUpdatePost}>
        <div className="my-3">
          <Label for="title">Title</Label>
          <Input
            type="textarea"
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
        <div className="my-3">
                <Label for="imageName">Image URL</Label>
                <Input
                    type="textarea"
                    id="imageName"
                    value={imageName}
                    onChange={(e) => setImageName(e.target.value)}
                    placeholder="Image URL"
                />
                {imageName && (
                    <div>
                        <p>Current Image:</p>
                        <img src={imageName} alt="Current Post Image" style={{ width: "100px", height: "auto" }} />
                    </div>
                )}
            </div>
        <Button type="submit" color="primary">Update Post</Button>
        <Button type="delete" color="secondary" onClick={handleCancelEdit}>Cancel</Button>
      </Form>
    );
  };
  
  export default EditPost;