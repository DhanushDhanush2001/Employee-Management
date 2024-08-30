import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Logo from "../Assets/logo.png";
import { UserContext } from "../context/userContext";

const Header = () => {
  const { currUser } = useContext(UserContext);

  return (

    <>
      <nav className="px-10 py-2  flex items-center justify-between w-full fixed bg-white top-0 left-0  z-10 shadow-md">
        <div className="flex space-x-10 items-center">
          <img src={Logo} alt="Logo" className="w-12 h-12" />
          <Link to={"/"} className="font-semibold">
            Home
          </Link>
          {currUser && (
            <Link to={"/employee-list"} className="font-semibold">
              Employee List
            </Link>
          )}
        </div>
        <div className="flex space-x-10">
          {currUser && <h1 className="font-semibold">{currUser?.user?.name}</h1>}
          {currUser ? (
            <Link to={"/logout"} className="font-semibold">
              LogOut
            </Link>
          ) : (
            <Link to={"/login"} className="font-semibold">
              Login
            </Link>
          )}
        </div>
      </nav>
    </>
  );
};

export default Header;
