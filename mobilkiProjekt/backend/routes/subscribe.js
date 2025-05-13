const express = require('express');
const router = express.Router();
const webpush = require('web-push');

// Ustaw klucze VAPID (wygeneruj je raz np. w terminalu i tu wklej)
const publicVapidKey = 'BJBS8ADWnHOcp38K6M5V-ej6PvMFTJPCKht_qkmp0K4vVEzHybkjnUU6mcO-SJaj5STyDrRqAwTEc9yB0wWGZnk';
const privateVapidKey = 'WjsbZpioLofZi7F_XyO2T_mVegrB3lHsjjQLeMzFF6A';

webpush.setVapidDetails(
  'mailto:example@yourdomain.org',
  publicVapidKey,
  privateVapidKey
);

// Obsługa POST /api/subscribe
router.post('/', (req, res) => {
  const subscription = req.body;

  // Tu możesz np. zapisać subskrypcję do bazy
  console.log('📩 Subskrypcja push:', subscription);

  res.status(201).json({ message: 'Subscribed successfully' });

  // Możesz też od razu wysłać testowe powiadomienie:
  const payload = JSON.stringify({ title: 'Dzięki za subskrypcję!' });

  webpush.sendNotification(subscription, payload).catch(error => {
    console.error('❌ Błąd wysyłania notyfikacji:', error);
  });
});

module.exports = router;
