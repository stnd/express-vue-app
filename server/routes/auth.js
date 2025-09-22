import express from "express";
import passport from "passport";
import { body, validationResult } from "express-validator";
import { User, Role } from "../models/index.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

// Registration route
router.post(
  "/register",
  [
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 6 }),
    body("firstName").notEmpty().trim(),
    body("lastName").notEmpty().trim(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password, username, firstName, lastName } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({
        where: { email },
      });

      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }

      // Create user
      const user = await User.create({
        email,
        password,
        username,
        firstName,
        lastName,
      });

      // Assign default role (viewer)
      const viewerRole = await Role.findOne({ where: { name: "viewer" } });
      if (viewerRole) {
        await user.addRole(viewerRole);
      }

      res.status(201).json({
        message: "User registered successfully",
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.post(
  "/login",
  [body("email").isEmail().normalizeEmail(), body("password").notEmpty()],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (!user) {
        return res.status(401).json({ error: info.message });
      }

      req.logIn(user, (err) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        return res.json({
          message: "Login successful",
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            roles: user.Roles.map((role) => ({
              id: role.id,
              name: role.name,
              permissions: role.permissions,
            })),
          },
        });
      });
    })(req, res, next);
  }
);

// Logout
router.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Could not destroy session" });
      }
      res.clearCookie("connect.sid");
      res.json({ message: "Logout successful" });
    });
  });
});

// Get current user
router.get("/me", isAuthenticated, (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      email: req.user.email,
      username: req.user.username,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      roles: req.user.Roles.map((role) => ({
        id: role.id,
        name: role.name,
        permissions: role.permissions,
      })),
    },
  });
});

export default router;
