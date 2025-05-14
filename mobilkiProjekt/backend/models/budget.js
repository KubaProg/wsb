const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // w przyszłości można dodać auth
  month: { type: String, required: true },  // np. '2025-05'
  amount: { type: Number, required: true },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Budget', budgetSchema);
