require("dotenv").config();
var express = require("express");
var cors = require("cors");
var mongoose = require("mongoose");

var app = express();

const routes = require("./routes/index");

const PORT = process.env.PORT || 5050;

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

//TODO : Make MongoURI Private
let mongoDB_URI = process.env.MONGODB_URI;

//Mongoose Connection
mongoose
    .connect(mongoDB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log(`MongoDB Connection Established`))
    .catch((error) => console.log(`Error in connecting DB Error => ${error}`));

//Checking Route
app.get("/", (req, res) => {
    res.status(200).json({ response: "Working Fine ..." });
});

/**
 * @description returns health of the app
 */
app.get("/health", (req, res) => {
    const healthcheck = {
        uptime: process.uptime(),
        message: 'OK',
        timestamp: Date.now()
    };
    res.status(200).json(healthcheck)
});

app.use(routes);


app.listen(PORT, () => console.log(`Server is running at PORT ${PORT}`));
