import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";
import axios from "axios";

const Login = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  const { setCurrUser } = useContext(UserContext);

   // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Validate form fields
  const validateForm = () => {
    let tempErrors = {};

    // Email validation
    if (!loginData.email) {
      tempErrors.email = "Email is required.";
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(loginData.email)) {
      tempErrors.email = "Invalid email format.";
    }

    // Password validation
    if (!loginData.password) {
      tempErrors.password = "Password is required.";
    } else if (loginData.password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters.";
    }

    setFormErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };
const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    
  // Validate form before submitting
    if (!validateForm()) return;
try {
      const response = await axios.post(
        `http://localhost:8000/api/v1/login`,
        loginData
      );
      const user = await response.data;
      setCurrUser(user);
      navigate("/employee-list");
    } catch (error) {
      setError(error.response.data.message);
      if (error.response && error.response.data) {
        setError(error.response.data.message || "Incorrect email or password.");
      } else {
        setError("An error occurred during login. Please try again.");
      }
  }
  };
  

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-gray-100 border rounded-md p-8 w-96">
        <h1 className="text-2xl font-semibold mb-4">Login</h1>
        <form onSubmit={handleLogin}>
          {error && (
            <p className="bg-red-500 px-3 py-1 rounded-md my-3 font-semibold">
              {error}
            </p>
          )}
          <div className="mb-4">
            <label
              htmlFor="Email"
              className="block text-sm font-medium text-gray-900"
            >
              email:
              <input
                type="email"
                id="Email"
                name="email"
                value={loginData.email}
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
                value={loginData.password}
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
              Login
            </button>
          </div>
          <small className="block mt-3 ">
            Don't have account
            <Link className="text-blue-700 ml-2" to={"/register"}>
              Sign Up
            </Link>
          </small>
        </form>
      </div>
    </div>
  );
};

export default Login;
