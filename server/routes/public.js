import { Router } from "express";

const router = Router();

// Public routes that don't require authentication
router.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

router.get("/public-content", (req, res) => {
  res.json({
    message: "Public content accessible to everyone",
    data: [
      { id: 1, title: "Welcome to our app" },
      { id: 2, title: "Getting started guide" },
    ],
  });
});

export default router;
