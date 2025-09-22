import { Router } from "express";
import { User, Role } from "../models/index.js";
import { isAuthenticated, hasRole } from "../middleware/auth.js";

const router = Router();

router.use(isAuthenticated);
router.use(hasRole(["admin", "manager", "editor"]));

// Add a new route to retrieve the list of country names in North America
router.get("/countries", async (req, res) => {
  try {
    // Fetch data from the REST Countries API
    // const response = await fetch("https://restcountries.com/v3.1/region/north%20america");
    const response = await fetch("https://restcountries.com/v3.1/all?fields=name,official,capital,population,region");
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    // Parse the JSON response
    const data = await response.json();
    
    // Extract relevant country information
    const countries = data.map((country) => ({
      name: country.name.common,
      official: country.name.official,
      capital: country.capital?.[0] || 'N/A',
      population: country.population,
      region: country.region
    }));
    
    res.json({ 
      success: true,
      count: countries.length,
      countries 
    });
  } catch (error) {
    console.error('Error fetching countries:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch country data',
      message: error.message 
    });
  }
});

export default router;
