import { Router } from "express";
import { User, Role } from "../models/index.js";
import { isAuthenticated, hasRole } from "../middleware/auth.js";

const router = Router();

router.use(isAuthenticated);
router.use(hasRole(["admin", "api"]));

// Add a new route to retrieve the list of country names in North America
router.get("/countries", async (req, res) => {
  try {
    // Use the fetch_url_content tool to download the response from the URL
    const response = await fetch("https://restcountries.com/v3.1/region/north%20america");
    
    // Parse the JSON response and extract the list of countries
    const countries = JSON.parse(response).map((country) => country.name);
    
    res.json({ countries });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
