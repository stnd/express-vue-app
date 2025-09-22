import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";
import cors from "cors";
import passport from "./config/passport.js";
import sequelize from "./config/database.js";
import { User, Role } from "./models/index.js";
import dotenv from "dotenv";
dotenv.config();

import publicRoutes from "./routes/public.js";
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";
import managerRoutes from "./routes/manager.js";
import editorRoutes from "./routes/editor.js";
import countriesRoutes from  "./routes/countries.js";

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your_super_duper_secret_key_here",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/public", publicRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/manager", managerRoutes);
app.use("/api/editor", editorRoutes);
app.use("/api/countries", countriesRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Initialize database and start server
const initializeApp = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection established successfully.");

    // Sync database
    await sequelize.sync({ force: false });
    console.log("Database synchronized.");

    // Create default roles if they don't exist
    const roles = [
      {
        name: "admin",
        description: "Full system access",
        permissions: [
          "create",
          "read",
          "update",
          "delete",
          "manage_users",
          "manage_roles",
        ],
      },
      {
        name: "manager",
        description: "Management access",
        permissions: ["create", "read", "update", "manage_users"],
      },
      {
        name: "editor",
        description: "Content editing access",
        permissions: ["create", "read", "update"],
      },
      {
        name: "viewer",
        description: "Read-only access",
        permissions: ["read"],
      },
    ];

    for (const roleData of roles) {
      await Role.findOrCreate({
        where: { name: roleData.name },
        defaults: roleData,
      });
    }

    console.log("Default roles created.");

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to initialize application:", error);
    process.exit(1);
  }
};

initializeApp();
