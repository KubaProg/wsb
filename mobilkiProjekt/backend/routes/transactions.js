const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const webpush = require('web-push');
const { getSubscription } = require('../subscriptionStore');

// VAPID keys – wklej swoje
const publicVapidKey = 'BJBS8ADWnHOcp38K6M5V-ej6PvMFTJPCKht_qkmp0K4vVEzHybkjnUU6mcO-SJaj5STyDrRqAwTEc9yB0wWGZnk';
const privateVapidKey = 'WjsbZpioLofZi7F_XyO2T_mVegrB3lHsjjQLeMzFF6A';

webpush.setVapidDetails(
  'mailto:example@yourdomain.org',
  publicVapidKey,
  privateVapidKey
);

// GET all transactions
router.get('/', async (req, res) => {
  const transactions = await Transaction.find().sort({ date: -1 });
  res.json(transactions);
});

// POST a new transaction
router.post('/', async (req, res) => {
  try {
    const newTransaction = new Transaction(req.body);
    await newTransaction.save();
    res.status(201).json(newTransaction);

    const sub = getSubscription();
    if (sub) {
      const payload = JSON.stringify({
        title: '📥 Nowa transakcja',
        body: `${newTransaction.type === 'income' ? '💰 Przychód' : '💸 Wydatek'} – ${newTransaction.amount} zł (${newTransaction.category})`
      });

      await webpush.sendNotification(sub, payload);
      console.log('📣 Wysłano powiadomienie push');
    }

  } catch (err) {
    console.error('❌ Błąd zapisu transakcji:', err);
    res.status(500).json({ error: 'Wewnętrzny błąd serwera' });
  }
});

module.exports = router;
