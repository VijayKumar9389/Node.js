const express = require('express');
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
require('dotenv').config();
const PORT = process.env.PORT || 8081;
const app = express();

//recognize incoming request as a JSON Object

app.use(express.json({limit: '50mb'}));

// parses cookies attached in the client request
app.use(cookieParser());

// recognize incoming request as an array
app.use(bodyParser.urlencoded({ extended: true }));

// bypass cross origin policiy
app.use(cors({
    origin: [ process.env.ORIGIN],
    methods: ["GET", "POST", "PUT"],
    credentials: true
}));

// Routes
app.get('/', (req, res) => {
    res.send("Triton Server is running...")
});

const tractRoutes = require("./api/routes/tract.route");
app.use('/api/tracts', tractRoutes);

const stakerholderRoutes = require("./api/routes/stakeholder.routes");
app.use('/api/stakeholders', stakerholderRoutes);

const LogRoutes = require("./api/routes/log.routes");
app.use('/api/logs', LogRoutes);

const authRoutes = require("./api/routes/auth.routes");
app.use('/api/auth/', authRoutes);

const surveyRoutes = require("./api/routes/survey.routes");
app.use('/api/survey/', surveyRoutes);


app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
});