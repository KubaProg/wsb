backend :

npm install

docker run -d --name mongo -p 27017:27017 -v mongo-data:/data/db mongo

node index.js

frontend:

npm install

ng serve lub alternatywnie prod build + lite-server

klucze:

Public Key:
BJBS8ADWnHOcp38K6M5V-ej6PvMFTJPCKht_qkmp0K4vVEzHybkjnUU6mcO-SJaj5STyDrRqAwTEc9yB0wWGZnk

Private Key:
WjsbZpioLofZi7F_XyO2T_mVegrB3lHsjjQLeMzFF6A

what has been done

1.  installing angular pwa support by: ng add @angular/pwa
    This does:

        Registers service worker support (serviceWorker: true in angular.json)

        Adds ngsw-config.json

        Adds default icons and manifest.webmanifest

2.  Create VAPID Keys for Web Push

Backend must send push notifications using VAPID keys.

Use this to generate:

npx web-push generate-vapid-keys

Save:

    publicKey → used in Angular (frontend)

    privateKey → used in Node backend (web-push package)

3. In Angular: Add Push Logic

readonly VAPID_PUBLIC_KEY = 'YOUR_PUBLIC_KEY_FROM_STEP_2';

enablePushNotifications() {
this.swPush.requestSubscription({
serverPublicKey: this.VAPID_PUBLIC_KEY
}).then(subscription => {
return this.http.post('http://localhost:3000/api/subscribe', subscription).subscribe();
}).catch(err => {
console.error('❌ Subskrypcja nie powiodła się:', err);
});
}

4. In Backend: Handle Subscription

Install dependencies:

npm install express web-push body-parser cors

Add route subscribe.js:

const express = require('express');
const webpush = require('web-push');
const router = express.Router();

const publicVapidKey = 'YOUR_PUBLIC_KEY';
const privateVapidKey = 'YOUR_PRIVATE_KEY';

webpush.setVapidDetails(
'mailto:you@example.com',
publicVapidKey,
privateVapidKey
);

router.post('/', (req, res) => {
const subscription = req.body;

// OPTIONAL: Save to DB

res.status(201).json({});
const payload = JSON.stringify({ title: 'Test notification' });

webpush.sendNotification(subscription, payload).catch(console.error);
});

module.exports = router;

In index.js:

app.use('/api/subscribe', require('./routes/subscribe'));

5. Build angular for prod using: ng build --configuration production

npm install lite-server

6. run by going into dist/app/browser and command: lite-server

do wykresow zainstalowalem:

npm install chart.js ng2-charts

JAK MASZ POKAZYWAC:

1. upewnij sie ze masz czysta baze i czysty application local storage w chrome

2. Dodaj wyplate np 10000

3. Pokaz ze sie zmienilo

4. Dodaj wydatek wakacje np 5000 i zmien dane na jakas dalsza

5. Pokaz ze sie zmienilo

6. Pobierz sobie apke PWA

7. wylacz backend -> powiedz ze nie dziala backend, czyli jakbysmy byli offline, dane nie pochodza z mongo, bo jest ono dla nas niedostepne -> pokaz ze dane nadal tam są

8. wracasz do tabu transakcje i dodajesz wydatek 1000zl na kota

9. Pojawia sie wydatek kota -> Idziesz do budzetu pokazac ze ubylo go

10. Wlaczasz backend z powrotem mowiac ze dane nie zapisywaly sie w mongo teraz z kotem tylko w local storage i dlatego musi zadzialc teraz logika synchronizujaca
