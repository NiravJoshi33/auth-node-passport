import { Request, Response } from "express";
import { IFormErrorMessage, IUser } from "../utils/schema";
import { User } from "../utils/schema";
import bcrypt from "bcryptjs";

export function register(req: Request, res: Response) {
  const { name, email, password, password2 } = req.body;

  // Validate the data
  let errors: IFormErrorMessage[] = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: "All fields are required" });
  }

  // Check if passwords match
  if (password !== password2) {
    errors.push({ msg: "Passwords do not match" });
  }

  // Check pass length
  if (password.length < 8) {
    errors.push({ msg: "Password must be at least 8 characters long" });
  }

  // Check email format
  if (!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
    errors.push({ msg: "Invalid email format" });
  }

  if (errors.length > 0) {
    res.render("register", { errors, name, email, password, password2 });
  } else {
    // Input Validation Passed
    // Check if email exists
    User.findOne({ email: email }).then((user) => {
      console.log(user);
      if (user) {
        console.log("user exists");
        errors.push({ msg: "Email already exists" });
        res.render("register", { errors, name, email, password, password2 });
      } else {
        const newUser = new User({ name, email, password });

        // Hash the password
        bcrypt.genSalt(10, (err, salt) => {
          if (err) throw err;
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;

            newUser.password = hash;
            newUser
              .save()
              .then(() => {
                req.flash(
                  "success_msg",
                  "You are now registered and can login"
                );
                res.redirect("/users/login");
              })
              .catch((err) => {
                console.log(err);
              });
          });
        });
      }
    });
  }
}
