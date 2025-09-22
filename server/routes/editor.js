import express from "express";
import { isAuthenticated, hasRole } from "../middleware/auth.js";

const router = express.Router();

// Middleware to ensure only editors, managers, and admins can access
router.use(isAuthenticated);
router.use(hasRole(["admin", "manager", "editor"]));

// Sample editor routes
router.get("/content", (req, res) => {
  res.json({
    message: "Editor content access granted",
    content: [
      { id: 1, title: "Sample Article", status: "draft" },
      { id: 2, title: "Published Article", status: "published" },
    ],
  });
});

router.post("/content", (req, res) => {
  // Create new content
  res.json({ message: "Content created successfully" });
});

router.put("/content/:id", (req, res) => {
  // Update content
  res.json({ message: `Content ${req.params.id} updated successfully` });
});

export default router;
