import React, { useState } from "react";
import { Link, json, useNavigate } from "react-router-dom";
import { Button } from "reactstrap"; // Import Button from reactstrap
import "../css/LoginPage.css";

export const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      const responseData = await response.json();
      console.log(responseData)

      if (responseData.statusCode === 200) {
        // Login successful
        localStorage.setItem("token", responseData.token);
        localStorage.setItem("role", responseData.role);
        localStorage.setItem("user",JSON.stringify(responseData.user));
        console.log(responseData.token);
        console.log(responseData.role);
        alert(responseData.message);
        console.log(responseData.message);

        navigate('/dashboard'); // Adjust the route as needed
        // Redirect user to dashboard or another page
      } else {
        // Login failed
        alert(responseData.message);
        console.error(responseData.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </label>
        <br />
        <div>
          <Button className="login-button" outline type="submit">
            {" "}
            Login{" "}
          </Button>
        </div>
      </form>
      <p className="register-text">
        Don't have an account?{" "}
        <Button className="button-register">
          <Link to="/register">Register here</Link>
        </Button>
      </p>
    </div>
  );
};

export default LoginPage;
