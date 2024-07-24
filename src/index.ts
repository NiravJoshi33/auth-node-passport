import express from "express";
import expressLayouts from "express-ejs-layouts";
import { PORT } from "./utils/app-config";
import { router } from "./routes/routes";
import { KEYS } from "./config/keys";
import DBUtils from "./utils/dbUtils";
import flash from "connect-flash";
import session from "express-session";
import passport from "passport";
import { initPassport } from "./config/passport-config";

const app = express();

initPassport(passport);

// Database Config
const db = KEYS.MONGO_URI;

// Connect to MongoDB
const dbUtils = DBUtils.getInstance();

// app.use(expressLayouts);
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false })); // Body Parser

// Session Config
app.use(
  session({
    secret: "Keyboard cat",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(flash()); // Flash Messages

// Global Variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

app.use(router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
