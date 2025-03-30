// Informacja o działaniu skryptu
console.log('Skrypt JavaScript działa!');

// Rejestracja Service Workera
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('sw.js')
      .then(registration => {
        console.log('Service Worker zarejestrowany poprawnie:', registration);
      })
      .catch(error => {
        console.error('Błąd podczas rejestracji Service Workera:', error);
      });
  });
}

// Sprawdzanie stanu zalogowania
const isLoggedIn = () => {
  return localStorage.getItem('loggedIn') === 'true';
};

// Logowanie
const login = (event) => {
  event.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (username === "admin" && password === "admin") {
    localStorage.setItem('loggedIn', 'true');
    showDashboard();
  } else {
    alert("Nieprawidłowa nazwa użytkownika lub hasło!");
  }
};

// Wylogowywanie
const logout = () => {
  localStorage.removeItem('loggedIn');
  showLoginPage();
};

// Pokazywanie paneli
const showLoginPage = () => {
  document.getElementById('loginPage').style.display = 'block';
  document.getElementById('dashboard').style.display = 'none';
};

const showDashboard = () => {
  document.getElementById('loginPage').style.display = 'none';
  document.getElementById('dashboard').style.display = 'block';
};

// Inicjalizacja
window.onload = () => {
  // Obsługa formularza logowania
  const loginForm = document.getElementById('loginForm');
  loginForm.addEventListener('submit', login);

  // Obsługa przycisku wylogowania
  const logoutBtn = document.getElementById('logoutBtn');
  logoutBtn.addEventListener('click', logout);

  // Sprawdzenie stanu logowania
  if (isLoggedIn()) {
    showDashboard();
  } else {
    showLoginPage();
  }
};
