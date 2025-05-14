const express = require('express');
const router = express.Router();
const webpush = require('web-push');
const { setSubscription, getSubscription } = require('../subscriptionStore');

// VAPID keys – te same co w transactions.js
const publicVapidKey = 'BJBS8ADWnHOcp38K6M5V-ej6PvMFTJPCKht_qkmp0K4vVEzHybkjnUU6mcO-SJaj5STyDrRqAwTEc9yB0wWGZnk';
const privateVapidKey = 'WjsbZpioLofZi7F_XyO2T_mVegrB3lHsjjQLeMzFF6A';

webpush.setVapidDetails(
  'mailto:example@yourdomain.org',
  publicVapidKey,
  privateVapidKey
);

// Zapisz subskrypcję
router.post('/', (req, res) => {
  const subscription = req.body;

  if (!subscription || !subscription.endpoint) {
    return res.status(400).json({ error: 'Niepoprawna subskrypcja' });
  }

  setSubscription(subscription); // zapisz do pamięci serwera
  res.status(201).json({ message: 'Subscribed successfully' });

  const payload = JSON.stringify({
    title: '🛎 Subskrypcja działa!',
    body: 'Będziesz otrzymywać powiadomienia push po dodaniu transakcji.'
  });

  webpush.sendNotification(subscription, payload).catch(error => {
    console.error('❌ Błąd wysyłania notyfikacji:', error);
  });
});

// Testowe powiadomienie
router.post('/test', (req, res) => {
  const subscription = getSubscription();

  if (!subscription || !subscription.endpoint) {
    return res.status(400).json({ error: 'Brak zapisanej subskrypcji' });
  }

  const payload = JSON.stringify({
    title: '🔔 Test powiadomienia',
    body: 'To jest testowe powiadomienie push.'
  });

  webpush.sendNotification(subscription, payload)
    .then(() => {
      console.log('✅ Wysłano testowe powiadomienie');
      res.status(200).json({ message: 'Wysłano testowe powiadomienie' });
    })
    .catch(error => {
      console.error('❌ Błąd wysyłania testu:', error);
      res.status(500).json({ error: 'Nie udało się wysłać powiadomienia' });
    });
});

module.exports = router;
