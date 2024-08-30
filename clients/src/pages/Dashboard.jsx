import React, { useContext } from "react";
import { UserContext } from "../context/userContext";

const Dashboard = () => {
  const { currUser } = useContext(UserContext);
  return (
    <div className="grid place-content-center h-screen">
      <h1 className="text-2xl font-semibold text-center">
        Welcome Admin Panel
      </h1>
      {!currUser ? (
        <h2></h2>
      ) : (
        <h2></h2>
      )}
    </div>
  );
};

export default Dashboard;
