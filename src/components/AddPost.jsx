import React, { useState, useEffect, useRef } from "react";
import { Card, CardBody, Input, Form, Label, Button } from "reactstrap";
import JoditEditor from "jodit-react";

const AddPost = ({ onPostAdded, user }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [imageName, setImageUrl] = useState("");
  const editor = useRef(null);

  useEffect(() => {
    // Fetch categories from the server
    const fetchCategories = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch("http://localhost:8080/category", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }

        const responseData = await response.json();
        setCategories(responseData); // Assuming responseData is an array of categories
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    console.log("Adding post with userId:", user.id, "and category:", category);

    try {
      const response = await fetch(
        `http://localhost:8080/admin/userId/${user.id}/category/${category}/posts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title, content, imageName }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create post");
      }

      const newPost = await response.json();
      console.log("New post created:", newPost);
      onPostAdded(newPost);
      setTitle("");
      setContent("");
      setCategory("");
      setImageUrl("");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="wrapper">
      <Card>
        <CardBody>
          <h3>Share your thoughts with a new post</h3>
          <Form onSubmit={handlePostSubmit}>
            <div className="my-3">
              <Label for="title">Post title</Label>
              <Input
                type="text"
                id="title"
                placeholder="Enter here"
                className="rounded-0"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="my-3">
              <Label for="content">Post content</Label>
              <JoditEditor
                ref={editor}
                value={content}
                className="rounded-0"
                style={{ height: "300px" }}
                onChange={(newContent) => setContent(newContent)}
              />
            </div>
            <div className="my-3">
              <Label for="category">Post category</Label>
              <Input
                type="select"
                id="category"
                className="rounded-0"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.categoryTitle}
                  </option>
                ))}
              </Input>
            </div>
            <div className="my-3">
              <Label for="imageUrl">Image URL</Label>
              <Input
                type="text"
                id="imageName"
                placeholder="Enter image URL"
                className="rounded-0"
                value={imageName}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>
            <Button type="submit" color="primary">
              Add Post
            </Button>
          </Form>
        </CardBody>
      </Card>
    </div>
  );
};

export default AddPost;
