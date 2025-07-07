require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require('path');
const app = express();

const routes = require("./routes");
app.use(express.static(path.join(__dirname, '..', '..', 'front_end')));

app.use(cors({
    credentials: true,
    origin: "http://localhost:5500",
    methods: ["GET", "POST", "DELETE"]
}));
app.use(express.json());
app.use(cookieParser());
app.use(routes);

app.listen(3000);