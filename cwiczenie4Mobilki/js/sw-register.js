if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./../service-worker.js')
    .then(() => console.log('✅ Service Worker zarejestrowany'))
    .catch(err => {
      console.error('❌ Błąd SW:', err); // ← pełny błąd
    });
}
