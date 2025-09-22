import passport from "passport";
import LocalStrategy from "passport-local";
import { User, Role } from "../models/index.js";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({
          where: { email, isActive: true },
          include: [
            {
              model: Role,
              attributes: ["id", "name", "permissions"],
            },
          ],
        });

        if (!user) {
          return done(null, false, { message: "Invalid email or password" });
        }

        const isValid = await user.validatePassword(password);
        if (!isValid) {
          return done(null, false, { message: "Invalid email or password" });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id, {
      include: [
        {
          model: Role,
          attributes: ["id", "name", "permissions"],
        },
      ],
    });
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport;
