import React, { useEffect, useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../context/userContext";
import axios from "axios";
import Loader from "../components/Loader";

const DeletePost = ({ postId: id }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(false);

    const { currentUser } = useContext(UserContext);
    const token = currentUser?.token;

    // Redirect to login page for any user who isn't logged in yet
    useEffect(() => {
        if (!token) {
            navigate("/login");
        }
    }, [navigate, token]);

    const removePost = async () => {
        setIsLoading(true);
        try {
            const response = await axios.delete(`${process.env.REACT_APP_BASE_URL}/posts/${id}`, {
                withCredentials: true,
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.status === 200) {
                if (location.pathname === `/myposts/${currentUser.id}`) {
                    navigate(0);
                } else {
                    navigate("/");
                }
            }
        } catch (error) {
            console.log("Couldn't Delete the Post");
        }
        setIsLoading(false);
    };

    if (isLoading) {
        return <Loader />;
    }

    return (
        <Link
            className="btn sm danger"
            onClick={() => {
                removePost(id);
            }}>
            Delete
        </Link>
    );
};

export default DeletePost;
