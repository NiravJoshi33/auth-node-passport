import passport from "passport";
import bcrypt from "bcryptjs";
import { Strategy } from "passport-local";
import { User } from "../utils/schema";

// Since, instead of using 'username', we are using 'email' to identify the user,
// we need to mention in the options inside Strategy constructor that the usernameField is 'email'
// By doing so, passport will look for email in the request body and pass it to the strategy
export default passport.use(
  new Strategy({ usernameField: "email" }, (username, password, done) => {
    User.findOne({ email: username })
      .then((user) => {
        if (!user) {
          return done(null, false, { message: "Email is not registered" });
        }

        // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;

          if (isMatch) {
            done(null, user);
          } else {
            done(null, false, { message: "Password is incorrect" });
          }
        });
      })
      .catch((err) => {
        return done(err, false);
      });
  })
);
