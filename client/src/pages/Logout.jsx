import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";

const Logout = () => {
    const { setCurrentUser } = useContext(UserContext);
    const navigate = useNavigate();

    setCurrentUser(null);
    navigate("/login");
    return <div>Logout</div>;
};

export default Logout;
