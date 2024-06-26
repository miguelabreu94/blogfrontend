import React, { useState, useEffect, useRef } from "react";
import { Card, CardBody, Input, Form, Label, Button } from "reactstrap";
import "../css/AddPost.css";
import { useNavigate } from "react-router-dom";


const AddPost = ({ user }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [imageName, setImageUrl] = useState("");
  const editor = useRef(null);
  const navigate = useNavigate();



  useEffect(() => {
    const fetchCategories = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch("http://localhost:8080/category/all", {
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

    console.log(
      "Adding post with userId:",
      user.id,
      "and categories:",
      selectedCategories
    );

    try {
      const response = await fetch(
        `http://localhost:8080/admin/${user.id}/posts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title,
            content,
            imageName,
            categories: selectedCategories,
          }),
        }
      );

      console.log("POST Body:", {
        title,
        content,
        imageName,
        categories: selectedCategories,
      });

      if (!response.ok) {
        throw new Error("Failed to create post");
      }

      const newPost = await response.json();
      console.log("New post created:", newPost);
      setTitle("");
      setContent("");
      setImageUrl("");

      navigate('/dashboard'); // Adjust the route as needed

    } catch (error) {
      console.error("Error:", error);
    }

    
  };

  const handleCheckboxChange = (e) => {
    const { value } = e.target;
    if (selectedCategories.includes(value)) {
      setSelectedCategories(
        selectedCategories.filter((category) => category !== value)
      );
    } else {
      setSelectedCategories([...selectedCategories, value]);
    }
  };

  return (
    <div className="wrapper">
      <Card>
        <CardBody>
          <h3>Partilhe as suas ideias criando um post</h3>
          <Form onSubmit={handlePostSubmit}>
            <div className="my-3">
              <Label for="title">Titulo</Label>
              <Input
                type="textarea"
                id="title"
                placeholder="Escreva aqui"
                className="rounded-0"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="my-3">
              <Label for="content">Conteúdo</Label>
              <Input
                type="textarea"
                ref={editor}
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Escreva aqui"
              />
            </div>
            <div className="my-3 category-container">
              <Label for="category">Post categories</Label>
              {categories.map((category) => (
                <div className="category-item" key={category}>
                  <div className="category-checkbox">
                    <input
                      type="checkbox"
                      id={`category-${category}`}
                      value={category}
                      checked={selectedCategories.includes(category)}
                      onChange={handleCheckboxChange}
                    />
                  </div>
                  <label
                    className="category-label"
                    htmlFor={`category-${category}`}
                  >
                    {category}
                  </label>
                </div>
              ))}
            </div>
            <div className="my-3">
              <Label for="imageUrl">Imagem</Label>
              <Input
                type="textarea"
                id="imageName"
                placeholder="Introduza o URL da imagem"
                className="rounded-0"
                value={imageName}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>
            <Button type="submit" color="primary">
              Criar Post
            </Button>
          </Form>
        </CardBody>
      </Card>
    </div>
  );
};

export default AddPost;
