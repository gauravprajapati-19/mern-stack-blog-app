import { Link } from "react-router-dom";

const Registered = () => {
    return (
        <section className="register">
            <div className="container">
                <h2>Successfully Registered!!</h2>
                <small>
                    Do you wanna Login?? <Link to="/login">Sign in</Link>
                </small>
            </div>
        </section>
    );
};

export default Registered;
