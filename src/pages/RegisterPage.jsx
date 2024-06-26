import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Button } from "reactstrap"; // Import Button from reactstrap
import "../css/RegisterPage.css"

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmpassword:"",
    fullName: "",
    bio: "",
  });

  const [isUsernameAvailable, setIsUsernameAvailable] = useState(true);

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

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match. Please re-enter your password.');
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          fullName: formData.fullName,
          bio: formData.bio,
        }),
      });

      const responseData = await response.json();

      if (responseData.statusCode === 200) {
        // Registration successful
        alert(responseData.message);
        console.log("Registration successful");
        navigate("/login", { state: "registered" });
      } else if (responseData.statusCode === 400) {
        // Registration failed due to username already in use
        console.error("Registration failed:", responseData.message);
        // Display error message to user
        alert(responseData.message); // You can replace this with a more elegant UI solution
      } else {
        // Other error occurred
        console.error("Registration failed:", responseData.error);
        // Display error message to user
        alert("Registration failed. Please try again later."); // You can replace this with a more elegant UI solution
      }
    } catch (error) {
      console.error("Error:", error);
      // Display error message to user
      alert("Error occurred. Please try again later."); // You can replace this with a more elegant UI solution
    }
  };

  return (
    <div className="register-container">
      <h2>Register User</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
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
            required
          />
        </label>
        <label>
          Confirm Password:
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Full Name:
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Bio:
          <input
            type="text"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <div>
          <Button className="button-regis">
            {" "}
            Register{" "}
          </Button>
        </div>
      </form>
      <p className="login-text">
        Already have an account? 
        <Link className="login-here" to="/login">Login here</Link>
      </p>
    </div>
  );
};

export default RegisterPage;
