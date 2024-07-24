import { Router } from "express";
import { register } from "./register";
import passport from "passport";

const router = Router();

router.get("/users/login", (req, res) => {
  res.render("login");
});

router.post("/users/login", (req, res, next) => {
  console.log("login");
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);
});

router.get("/users/register", (req, res) => {
  res.render("register");
});

router.get("/", (req, res) => {
  res.render("welcome");
});

router.post("/users/register", (req, res) => register(req, res));

export { router };
