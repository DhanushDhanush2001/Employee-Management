import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

   // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

 // Validate form fields
  const validateForm = () => {
    let tempErrors = {};

    // Username validation
    if (!registerData.username) {
      tempErrors.username = "Username is required.";
    } else if (registerData.username.length < 3) {
      tempErrors.username = "Username must be at least 3 characters.";
    }

    // Email validation
    if (!registerData.email) {
      tempErrors.email = "Email is required.";
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(registerData.email)) {
      tempErrors.email = "Invalid email format.";
    }

    // Password validation
    if (!registerData.password) {
      tempErrors.password = "Password is required.";
    } else if (registerData.password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters.";
    }

    setFormErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

// Handle registration submission
   const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
// Validate form before submitting
    if (!validateForm()) return;
    try {
      const response = await axios.post(
        `http://localhost:8000/api/v1/register`,
        registerData
      );
      const newUser = await response.data;
      // Check if registration was successful
      if (!newUser) {
        setError("couldn't registered please try again");
       return;
      }
     // Redirect to login page upon successful registration
      navigate("/login");
    } catch (err) {
      setError(err.response.data.message);
    // Handle errors like email already exists
      if (err.response && err.response.data) {
        setError(err.response.data.message || "Email already exists.");
      } else {
        setError("An error occurred during registration. Please try again.");
      }
    }

 // Reset form data
     setRegisterData({
      name: "",
      email: "",
      password: "",
    });
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-gray-100 border rounded-md p-8 w-96">
        <h1 className="text-2xl font-semibold mb-4">Register</h1>
        <form onSubmit={handleRegister}>
          {error && (
            <p className="bg-red-500 px-3 py-1 rounded-md my-3 font-semibold">
              {error}
            </p>
          )}
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-900"
            >
              Username:
              <input
                type="text"
                id="username"
                name="username"
                value={registerData.username}
                onChange={handleInputChange}
                className="mt-1 p-2 w-full border rounded-md"
                required
              />
            </label>
 {formErrors.username && (
              <span className="text-red-500">{formErrors.username}</span>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-900"
            >
              Email:
              <input
                type="email"
                id="email"
                name="email"
                value={registerData.email}
                onChange={handleInputChange}
                className="mt-1 p-2 w-full border rounded-md"
                required
              />
            </label>
             {formErrors.email && (
              <span className="text-red-500">{formErrors.email}</span>
            )}
           </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-900"
            >
              Password:
              <input
                type="password"
                id="password"
                name="password"
                value={registerData.password}
                onChange={handleInputChange}
                className="mt-1 p-2 w-full border rounded-md"
                required
              />
            </label>
              {formErrors.password && (
              <span className="text-red-500">{formErrors.password}</span>
            )}
          </div>

          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Register
            </button>
          </div>
          <small className="block mt-2 ">
            Already registered{" "}
            <Link className="text-blue-700 ml-2" to={"/login"}>
              SignIn
            </Link>
          </small>
        </form>
      </div>
    </div>
  );
};

export default Register;
