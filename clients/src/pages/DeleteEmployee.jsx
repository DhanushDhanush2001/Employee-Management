import React, { useContext, useEffect } from "react";
import { UserContext } from "../context/userContext";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const DeleteEmployee = () => {
  const { currUser } = useContext(UserContext);
  const token = currUser?.token;

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [navigate, token]);

  const { id } = useParams();

  useEffect(() => {
    const deleteEmployee = async () => {
      try {
        const response = await axios.delete(
          `http://localhost:8000/api/v1/deleteEmployee/${id}`,
          
        );

        if (response.status === 200) {
          navigate("/employee-list");
        }
      } catch (error) {
        console.log(error.response.data.message);
      }
    };
    deleteEmployee();
  }, [id]);

  return <></>;
};

export default DeleteEmployee;
