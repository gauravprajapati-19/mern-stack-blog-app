const express = require("express");
const cors = require("cors");
const { connect } = require("mongoose");
require("dotenv").config();
const upload = require("express-fileupload");

const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
// app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

// ✅ Updated CORS configuration
const allowedOrigins = ['http://localhost:3000', 'http://nextechdev.site', 'https://nextechdev.site'];
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            console.log("✅ Allowed CORS Origin:", origin);
            callback(null, true);
        } else {
            console.warn("⛔ Blocked CORS Origin:", origin);
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));

app.use(upload());
app.use("/uploads", express.static(__dirname + "/uploads"));

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

app.use(notFound);
app.use(errorHandler);

connect(process.env.MONGO_URI)
    .then(app.listen(process.env.PORT || 5000, () => console.log(`Server Started on port ${process.env.PORT}`)))
    .catch((error) => {
        console.log(error);
    });
