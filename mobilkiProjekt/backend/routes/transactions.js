const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

// GET all transactions
router.get('/', async (req, res) => {
  const transactions = await Transaction.find().sort({ date: -1 });
  res.json(transactions);
});

// POST a new transaction
router.post('/', async (req, res) => {
  const newTransaction = new Transaction(req.body);
  await newTransaction.save();
  res.status(201).json(newTransaction);
});

module.exports = router;
