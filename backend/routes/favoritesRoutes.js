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


router.post("/", authenticateToken, async (req, res) => {  //Get the recipe and action from the request body
  try {
    const { recipe } = req.body;
    const user = await User.findOne({ username: req.user.username });
    user.favorites.push(recipe);
    await user.save();
    res.status(201).send("Favorite added");
  } catch (err) {
    res.status(500).send("Error adding favorite");
  }
});

module.exports = router;
