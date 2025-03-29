// Informacja o działaniu skryptu
console.log('Skrypt JavaScript działa!');

// Rejestracja Service Workera
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(registration => {
                console.log('Service Worker zarejestrowany poprawnie:', registration);
            })
            .catch(error => {
                console.error('Błąd podczas rejestracji Service Workera:', error);
            });
    });
}
