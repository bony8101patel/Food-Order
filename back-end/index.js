const express = require("express");
const sequelize = require("./config/dbConfig");
const path = require("path");
const bodyParser = require("body-parser");
const route = require("./routes/routes");
const cors = require("cors");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use('/public/assets', express.static(path.join(__dirname, 'public', 'assets')));

app.use(route.Routes);

sequelize;
app.listen(5000);