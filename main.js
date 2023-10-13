//admin_hazem_1 Hazem
// imports
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
mongoose.set("strictQuery", true)
const session = require("express-session");

const app = express();
const PORT = process.env.PORT || 4000;

//DataBase Connection    **>> {userNewParser: true } >> Falid
mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("Connnected To DataBAse"));

// MiddleWares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
  session({
    secret: "My Secret Key",
    saveUninitialized: true,
    resave: false,
  })
);

app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});

app.use(express.static("uploads"));

// Set Template Engine
app.set("view engine", "ejs");

// route prefix
app.use("", require("./routes/routes"));

app.listen(PORT, () => {
  console.log(`Server Started At http://localhost:${PORT}`);
});
