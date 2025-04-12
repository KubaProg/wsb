const API_URL = 'http://localhost:3000';

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

// Sprawdzenie stanu logowania
const isLoggedIn = () => localStorage.getItem('loggedIn') === 'true';

// Rejestracja użytkownika
const register = async (event) => {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch(`${API_URL}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || 'Błąd rejestracji');
      return;
    }

    alert(data.message || 'Rejestracja zakończona!');
    showLoginPage();
  } catch (error) {
    console.error('Błąd:', error);
  }
};

// Logowanie
const login = async (event) => {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch(`${API_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || 'Błąd logowania');
      return;
    }

    localStorage.setItem('loggedIn', 'true');
    showDashboard();
  } catch (error) {
    console.error('Błąd:', error);
  }
};

// Wylogowanie
const logout = () => {
  localStorage.removeItem('loggedIn');
  showLoginPage();
};

// Widoki
const showLoginPage = () => {
  document.getElementById('loginPage').style.display = 'block';
  document.getElementById('registrationForm').style.display = 'none';
  document.getElementById('dashboard').style.display = 'none';
};

const showRegistrationForm = () => {
  document.getElementById('loginPage').style.display = 'none';
  document.getElementById('registrationForm').style.display = 'block';
  document.getElementById('dashboard').style.display = 'none';
};

const showDashboard = () => {
  document.getElementById('loginPage').style.display = 'none';
  document.getElementById('registrationForm').style.display = 'none';
  document.getElementById('dashboard').style.display = 'block';
};

// Inicjalizacja
window.onload = () => {
  document.getElementById('loginForm').addEventListener('submit', login);
  document.getElementById('registerForm').addEventListener('submit', register);
  document.getElementById('logoutBtn').addEventListener('click', logout);
  document.getElementById('switchToRegister').addEventListener('click', showRegistrationForm);
  document.getElementById('switchToLogin').addEventListener('click', showLoginPage);

  isLoggedIn() ? showDashboard() : showLoginPage();
};
