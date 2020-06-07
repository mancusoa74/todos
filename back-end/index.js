const express = require("express");
const PORT = process.env.PORT || 4000;
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
var compression = require('compression');
const app = express();


console.log("START TODOS BACK-END SERVER");

app.use(compression());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan("dev"));

const todos = require("./api/routes/todosRouter");
app.use("/todos", todos);
app.get("/", (req, res) => {
  res.json("ToDos Back-End");
});

app.listen(PORT, () => {
  console.log(`ToDos Back-End is running on ${PORT}`);
});
