import React, { useState, useEffect, useRef } from "react";
import { Card, CardBody, Input, Form, Label, Button } from "reactstrap";
import "../css/AddPost.css";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";


const AddPost = ({ user }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [imageName, setImageUrl] = useState("");
  const [scheduledDate, setscheduledDate] = useState('');
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

    const submitPost = async () => {
      console.log("submitPost function called");
      const token = localStorage.getItem("token");
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
              scheduledDate,
            }),
          }
        );
  
        console.log("POST Body:", {
          title,
          content,
          imageName,
          categories: selectedCategories,
          scheduledDate,
        });
  
        if (!response.ok) {
          throw new Error("Failed to create post");
        }
  
        const newPost = await response.json();
        console.log("New post created:", newPost);
        setTitle("");
        setContent("");
        setImageUrl("");
        setscheduledDate("");
  
      } catch (error) {
        console.error("Error:", error);
        toast.error("Failed to schedule post");
      }
    };

const handlePostSubmit = (e) => {
  e.preventDefault();
  console.log("handlePostSubmit function called");
  const desiredDateTime = new Date(scheduledDate).getTime();
  const currentTime = new Date().getTime();
  const delay = desiredDateTime - currentTime;

  console.log("Calculated delay:", delay);

  if (delay > 0) {
    console.log("Post will be submitted in:", delay, "ms");
    setTimeout(() => {
      submitPost();
    }, delay);
    toast.success("Post successfully scheduled", {
      autoClose: 1000, // Close after 1 seconds
      onClose: () => navigate('/dashboard') // Redirect after showing toast
    });
  } else {
    console.log("Post will be submitted immediately");
    submitPost();
    toast.success("Post successfully created", {
      autoClose: 1000, // Close after 1 seconds
      onClose: () => navigate('/dashboard') // Redirect after showing toast
    });
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
                maxLength={45}
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
            <div className="datetime-container my-3">
              <Label for="scheduledDate">Data e hora agendada</Label>
              <Input
                type="datetime-local"
                id="scheduledDate"
                value={scheduledDate}
                onChange={(e) => setscheduledDate(e.target.value)}
              />
            </div>
            <Button type="submit" color="primary">
              Criar Post
            </Button>
          </Form>
        </CardBody>
      </Card>
      <ToastContainer />
    </div>
  );
};

export default AddPost;
