import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
// require("dotenv").config();
// import { registerUser } from "../../../server/controllers/userControllers";

const Register = () => {
    const [userData, setUserData] = useState({
        name: "",
        email: "",
        password: "",
        password2: "",
    });

    const [error, setError] = useState("");
    const navigate = useNavigate();

    const changeInputHandler = (e) => {
        setUserData((prevState) => {
            return { ...prevState, [e.target.name]: e.target.value };
        });
    };

    // const registerUser = async (e) => {
    //     e.preventDefault();
    //     setError("");
    //     try {
    //         const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/users/register`, userData);
    //         console.log(response);

    //         const newUser = await response.data;
    //         console.log(newUser);
    //         if (!newUser) {
    //             setError("Couldn't register user. Please try again.");
    //         }
    //         navigate("/registered");
    //     } catch (err) {
    //         setError(err.response.data.message);
    //     }
    // };

    const registerUser = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/users/register`, userData);

            // Check if response and data exist
            if (response && response.data) {
                console.log("User registered successfully:", response.data);
                navigate("/registered");
            } else {
                setError("Unexpected server response. Please try again.");
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Registration failed. Please try again.");
        }
    };

    return (
        <section className="register">
            <div className="container">
                <h2>Sign Up</h2>
                <form action="" className="form register_form" onSubmit={registerUser}>
                    {error && <p className="form_error-message">{error}</p>}
                    <input type="text" placeholder="Full Name" name="name" value={userData.name} onChange={changeInputHandler} />
                    <input type="text" placeholder="Email" name="email" value={userData.email} onChange={changeInputHandler} />
                    <input type="password" placeholder="Password" name="password" value={userData.password} onChange={changeInputHandler} />
                    <input type="password" placeholder="Confirm Password" name="password2" value={userData.password2} onChange={changeInputHandler} />
                    <button type="submit" className="btn primary">
                        Register
                    </button>
                </form>
                <small>
                    Already have an account? <Link to="/login">Sign in</Link>
                </small>
            </div>
        </section>
    );
};

export default Register;
