import express from "express";
import { User, Role } from "../models/index.js";
import { isAuthenticated, hasRole } from "../middleware/auth.js";

const router = express.Router();

// Middleware to ensure only managers and admins can access
router.use(isAuthenticated);
router.use(hasRole(["admin", "manager"]));

// Get users (limited info)
router.get("/users", async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: [
        "id",
        "username",
        "firstName",
        "lastName",
        "email",
        "isActive",
      ],
      include: [
        {
          model: Role,
          attributes: ["name"],
        },
      ],
    });

    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Toggle user active status
router.patch("/users/:userId/status", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      message: `User ${
        user.isActive ? "activated" : "deactivated"
      } successfully`,
      user: { id: user.id, isActive: user.isActive },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
