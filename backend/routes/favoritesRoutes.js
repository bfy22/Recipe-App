const express = require("express");
const router = express.Router();
const User = require("../models/user");
const authenticateToken = require("../middleware/authMiddleware");


//backend error handling and routing for favorites feature management

router.get("/", authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.user.username });
    res.json(user.favorites || []);
  } catch (err) {
    res.status(500).send("Error fetching favorites");
  }
});


router.post("/", authenticateToken, async (req, res) => {
  try {
    const { recipe, action } = req.body;
    const user = await User.findOne({ username: req.user.username });

    if (!user) return res.status(404).send("User not found");
    if (!Array.isArray(user.favorites)) user.favorites = [];

    if (action === 'add') {
      user.favorites.push(recipe);
    } else if (action === 'remove') {
      user.favorites = user.favorites.filter(r => r.id !== recipe.id);
    } else {
      return res.status(400).send("Invalid action");
    }

    await user.save();
    res.status(200).send("Favorites updated");
  } catch (err) {
    console.error("Error updating favorites:", err);
    res.status(500).send("Error updating favorites");
  }
});


module.exports = router;
