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

router.post('/test', (req, res) => {
  const sub = getSubscription();
  if (!sub) return res.status(400).json({ error: 'Brak subskrypcji' });

  const payload = JSON.stringify({
    title: '🔔 Testowe powiadomienie',
    body: 'To jest testowy push od backendu'
  });

  webpush.sendNotification(sub, payload)
    .then(() => {
      console.log('✅ Testowe powiadomienie wysłane');
      res.json({ message: 'Test sent' });
    })
    .catch(err => {
      console.error('❌ Błąd przy testowym pushu', err);
      res.status(500).json({ error: 'Push error' });
    });
});


module.exports = router;
