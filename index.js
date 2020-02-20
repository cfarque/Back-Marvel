require("dotenv").config();
const express = require("express");
const formidableMiddleware = require("express-formidable");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
app.use(formidableMiddleware());
app.use(cors());

mongoose.connect("mongodb://localhost/marvel", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const routetest = require("./Routes/routetest");
app.use(routetest);
const characters = require("./Routes/characters");
app.use(characters);
const comics = require("./Routes/comics");
app.use(comics);

app.get("/", (req, res) => {
  res.json({ message: "test route" });
});

app.all("*", (req, res) => {
  res.json({ message: "page not found" });
});

app.listen(process.env.PORT, () => {
  console.log("server started");
});
