import React from "react";
import { Link } from "react-router-dom";

const categories = ["Agriculture", "Business", "Education", "Entertainment", "Art", "Investment", "Uncategorized", "Weather"];

const Footer = () => {
    return (
        <footer>
            <ul className="footer_categories">
                {categories.map((category) => {
                    return (
                        <li>
                            <Link to={`/posts/categories/${category}`}>{`${category}`}</Link>
                        </li>
                    );
                })}
            </ul>
            <div className="footer_copyright">
                <small>All Rights Reserved &copy; Copyright, Gaurav Prajapati.</small>
            </div>
        </footer>
    );
};

export default Footer;
