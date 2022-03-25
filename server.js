const express = require('express');
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
require('dotenv').config();
const PORT = process.env.PORT || 5000;
directoryToServe = 'client'
const app = express();

const fs = require('fs');
const https = require('https');
const path = require('path');

//recognize incoming request as a JSON Object
app.use(express.json());

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

app.use('/', express.static(path.join(__dirname, '..', directoryToServe)))

const httpsOptions = {
    cert: fs.readFileSync(path.join(__dirname, 'ssl', 'server.crt')),
    key: fs.readFileSync(path.join(__dirname, 'ssl', 'server.key'))
}

// Routes
app.get('/', (req, res) => {
    res.send("API Connected")
});

const tractRoutes = require("./api/routes/tract.route");
app.use('/api/tracts', tractRoutes);

const stakerholderRoutes = require("./api/routes/stakeholder.routes");
app.use('/api/stakeholders', stakerholderRoutes);

const authRoutes = require("./api/routes/auth.routes");
const { connect } = require('./config/database');
app.use('/api/auth/', authRoutes);

app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
});

https.createServer(httpsOptions, app)
.listen(PORT, () => {
    console.log(`Serving ${directoryToServe}/ at ${PORT}`);
})