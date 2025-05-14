const express = require('express');
const router = express.Router();
const Budget = require('../models/budget');

// GET budget for given month
router.get('/:month', async (req, res) => {
  const { month } = req.params;
  const budget = await Budget.findOne({ userId: 'demo', month });
  res.json(budget || { amount: 0 });
});

// SET/UPDATE budget
router.post('/', async (req, res) => {
  const { month, amount } = req.body;
  const updated = await Budget.findOneAndUpdate(
    { userId: 'demo', month },
    { amount, updatedAt: new Date() },
    { upsert: true, new: true }
  );
  res.json(updated);
});

module.exports = router;
