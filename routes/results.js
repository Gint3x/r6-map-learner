const express = require('express');
const router = express.Router();

let userResults = [];

// Store user results
router.post('/', (req, res) => {
  const { user, correct, total } = req.body;
  userResults.push({ user, correct, total });

  res.json({ message: 'Result saved!' });
});

// Get all results
router.get('/', (req, res) => {
  res.json(userResults);
});

module.exports = router;
