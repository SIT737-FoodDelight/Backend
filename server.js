if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const indexRouter = require("./routes/index");
const registerRouter = require("./routes/register");
const loginRouter = require("./routes/login");
const dashboardRouter = require("./routes/dashboard");
const passport = require("passport");
const session = require("express-session");
const ejs = require("ejs");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { forwardAuthenticated } = require("./config/auth");
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("layout", "layouts/layout");
app.use(expressLayouts);
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

require("./config/passport")(passport);

const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("connected to mongoose"));

app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.get("/", (req, res) => {
  res.render("index");
});
app.get("/login", (req, res) => {
  res.render("index");
});
app.get("/users/login", (req, res) => {
  res.send("failure");
});
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);
app.get("/dashboard", forwardAuthenticated, (req, res) => {
  res.render("dashboard");
});
app.get("/auth/facebook", passport.authenticate("facebook"));
app.use("/", indexRouter);
app.use("/register", registerRouter);
app.use("/login", loginRouter);
app.use("/dashboard", dashboardRouter);

app.get("/loginSuccess", (req, res) => {
  res.json("login_Success");
});
app.get("/loginFailure", (req, res) => {
  res.json("login_failed");
});
app.listen(process.env.PORT || 3000, () => {
  console.log("Server started...");
});
