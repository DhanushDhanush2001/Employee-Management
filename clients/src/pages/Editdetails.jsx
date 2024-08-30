import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/userContext";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const EditDetails = ({ onCreateEmployee }) => {
  const { currUser } = useContext(UserContext);
  const token = currUser?.token;

  const navigate = useNavigate();
  const { id } = useParams();
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [image, setImage] = useState("");
  const [employeeData, setEmployeeData] = useState({
    name: "",
    email: "",
    mobile: "",
    designation: "",
    gender: "",
    courses: [],
  });

  // Available courses
  const availableCourses = ["BCA", "MCA", "BSc"];

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [navigate, token]);

  // Fetch employee data only once when the component mounts
  useEffect(() => {
    if (id) {
      getEmployee();
    }
  }, [id]);

  // Fetch employee details by ID
  const getEmployee = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/getSingleEmployee/${id}`
      );
      const employee = response.data.employee;
      if (employee) {
        setEmployeeData({
          name: employee.name,
          email: employee.email,
          mobile: employee.mobile,
          designation: employee.designation,
          gender: employee.gender,
          courses: employee.courses || [],
        });
      }
    } catch (error) {
      setError(error.response?.data?.message || "Error fetching employee data.");
    }
  };

  // Handle image file change
  const onChangeImage = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  // Handle input changes including checkbox updates
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
  
    setEmployeeData((prevData) => {
      if (type === "checkbox") {
        // Add or remove courses based on checkbox state
        const updatedCourses = checked
          ? [...prevData.courses, value]
          : prevData.courses.filter((course) => course !== value);
  
        return {
          ...prevData,
          courses: updatedCourses,
        };
      }
  
      return {
        ...prevData,
        [name]: value,
      };
    });
  };

  const validateForm = () => {
    let tempErrors = {};
    if (!employeeData.name.trim()) tempErrors.name = "Name is required.";
    if (!employeeData.email) {
      tempErrors.email = "Email is required.";
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(employeeData.email)) {
      tempErrors.email = "Invalid email format.";
    }
    if (!employeeData.mobile) {
      tempErrors.mobile = "Mobile number is required.";
    } else if (!/^\d{10}$/.test(employeeData.mobile)) {
      tempErrors.mobile = "Mobile number must be 10 digits.";
    }

    setFormErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;
  
    try {
      const formData = new FormData();
      formData.append("name", employeeData.name);
      formData.append("email", employeeData.email);
      formData.append("mobile", employeeData.mobile);
      formData.append("designation", employeeData.designation);
      formData.append("gender", employeeData.gender);
      // Convert courses array to JSON string for backend processing
      formData.append("courses", JSON.stringify(employeeData.courses));
  
      if (image) {
        formData.append("image", image);
      }
  
      // Update employee if id exists, otherwise create a new one
      if (id) {
        await axios.put(
          `http://localhost:8000/api/v1/updateEmployee/${id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        await axios.post(`http://localhost:8000/api/v1/create`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }
  
      navigate("/employee-list");
    } catch (error) {
      console.log(error);
      setError(error.response?.data?.message || "Error updating employee.");
    }
  };
  return (
    <div className="flex items-center justify-center h-screen mt-20">
      <div className="max-w-[60%] bg-gray-100 border rounded-md p-8">
        <h1 className="text-2xl font-semibold mb-4">{id ? 'EDIT' : "Create"} Employee</h1>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          {error && (
            <p className="px-3 py-1 rounded-md mb-4 font-semibold bg-red-500">
              {error}
            </p>
          )}
          <div className="col-span-2 w-full">
            <label className="block text-sm font-medium text-gray-600">
              Name:
              <input
                type="text"
                name="name"
                value={employeeData.name}
                onChange={handleInputChange}
                className="mt-1 p-2 w-full border rounded-md"
              />
            </label>
            {formErrors.name && <span className="text-red-500">{formErrors.name}</span>}
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-600">
              Email:
              <input
                type="email"
                name="email"
                value={employeeData.email}
                onChange={handleInputChange}
                className="mt-1 p-2 w-full border rounded-md"
              />
            </label>
            {formErrors.email && <span className="text-red-500">{formErrors.email}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">
              Mobile:
              <input
                type="text"
                name="mobile"
                value={employeeData.mobile}
                onChange={handleInputChange}
                className="mt-1 p-2 w-full border rounded-md"
              />
            </label>
            {formErrors.mobile && <span className="text-red-500">{formErrors.mobile}</span>}
          </div>
          <div className="mb-4">
            <label
              htmlFor="designation"
              className="block text-sm font-medium text-gray-600"
            >
              Designation:
            </label>
            <select
              id="designation"
              name="designation"
              value={employeeData.designation}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border rounded-md"
            >
              <option value="">Select a designation</option>
              <option value="HR">HR</option>
              <option value="Manager">Manager</option>
              <option value="Sales">Sales</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Courses:
            </label>
            <div className="flex mt-3">
              {availableCourses.map((course) => (
                <label className="mr-4" key={course}>
                  <input
                    type="checkbox"
                    name="courses"
                    value={course}
                    checked={employeeData.courses.includes(course)}
                    onChange={handleInputChange}
                    className="mr-1"
                  />
                  {course}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">
              Gender:
              <div className="flex mt-3">
                <label className="mr-4">
                  <input
                    type="radio"
                    name="gender"
                    value="Male"
                    checked={employeeData.gender === "Male"}
                    onChange={handleInputChange}
                    className="mr-1"
                  />
                  Male
                </label>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="Female"
                    checked={employeeData.gender === "Female"}
                    onChange={handleInputChange}
                    className="mr-1"
                  />
                  Female
                </label>
              </div>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">
              Image
              <input
                type="file"
                onChange={onChangeImage}
                accept="png,jpg,jpeg"
                name="image"
                className="mt-1 p-2 w-full border rounded-md"
              />
            </label>
          </div>

          <div className="col-span-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md w-full"
            >
              Update Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDetails;
