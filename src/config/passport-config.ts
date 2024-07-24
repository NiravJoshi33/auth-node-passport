import * as passportLocal from "passport-local";
import * as passport from "passport";
import { compare } from "bcryptjs";
import { User } from "../utils/schema";

export function initPassport(passport: passport.PassportStatic) {
  passport.use(
    new passportLocal.Strategy(
      {
        usernameField: "email",
      },
      (email, password, done) => {
        // Match user against user database
        User.findOne({ email })
          .then((user) => {
            if (!user) {
              return done(null, false, { message: "Email is not registered" });
            }

            // Match password
            compare(password, user.password, (err, isMatch) => {
              if (err) throw err;

              if (isMatch) {
                return done(null, user);
              } else {
                return done(null, false, { message: "Password is incorrect" });
              }
            });
          })
          .catch((err) => console.log(err));
      }
    )
  );

  // Used to serialise the user for the session
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  // Used to deserialise the user
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .then((user) => {
        if (!user) {
          done(null, false);
        }
      })
      .catch((err) => {
        done(err, false);
      });
  });
}
