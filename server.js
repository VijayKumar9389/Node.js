const express = require('express');
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
require('dotenv').config();
const PORT = process.env.PORT || 5000;
const app = express();

function forceHttps(req, res, next) {
    const xfp =
        req.headers["X-Forwarded-Proto"] || req.headers["x-forwarded-proto"];
    if (xfp === "http") {
        res.redirect(301, `https://${hostname}${req.url}`);
    } else {
        next();
    }
}

//recognize incoming request as a JSON Object
app.use(express.json());
app.use(forceHttps());

// parses cookies attached in the client request
app.use(cookieParser());

// recognize incoming request as an array
app.use(bodyParser.urlencoded({ extended: true }));

// bypass cross origin policiy
app.use(cors({
    origin: ["https://www.tritonsrm.com"],
    methods: ["GET", "POST", "PUT"],
    credentials: true
}));

//Declare session  
app.use(session({
    key: "Token",
    proxy: true,
    secret: "Testing",
    resave: false,
    saveUninitialized: false,
    cookie: {
        Expires: 100
    }
}));

// Routes
app.use('/', (req, res, next) => {
    res.send("hello")
});

const tractRoutes = require("./api/routes/tract.route");
app.use('/api/tracts', tractRoutes);

const stakerholderRoutes = require("./api/routes/stakeholder.routes");
app.use('/api/stakeholders', stakerholderRoutes);

const authRoutes = require("./api/routes/auth.routes");
app.use('/api/auth/', authRoutes);

app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
});