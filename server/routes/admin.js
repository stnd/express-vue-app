import express from "express";
import { User, Role } from "../models/index.js";
import { isAuthenticated, hasRole } from "../middleware/auth.js";
import { body, validationResult } from "express-validator";

const router = express.Router();

// Middleware to ensure the user is authenticated and has admin role
router.use(isAuthenticated);
router.use(hasRole(["admin"]));

// Get all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.findAll({
      include: [
        {
          model: Role,
          attributes: ["id", "name"],
        },
      ],
      attributes: { exclude: ["password"] },
    });

    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Assign role to user
router.post(
  "/users/:userId/roles",
  [body("roleId").isInt({ min: 1 })],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { userId } = req.params;
      const { roleId } = req.body;

      const user = await User.findByPk(userId);
      const role = await Role.findByPk(roleId);

      if (!user || !role) {
        return res.status(404).json({ error: "User or role not found" });
      }

      await user.addRole(role);
      res.json({ message: "Role assigned successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Remove role from user
router.delete("/users/:userId/roles/:roleId", async (req, res) => {
  try {
    const { userId, roleId } = req.params;

    const user = await User.findByPk(userId);
    const role = await Role.findByPk(roleId);

    if (!user || !role) {
      return res.status(404).json({ error: "User or role not found" });
    }

    await user.removeRole(role);
    res.json({ message: "Role removed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all roles
router.get("/roles", async (req, res) => {
  try {
    const roles = await Role.findAll();
    res.json({ roles });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
