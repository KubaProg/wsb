const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// 🔓 Globalne CORS dla każdego źródła i wszystkich metod
const corsOptions = {
    origin: 'https://timely-puppy-761429.netlify.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  };
  
  app.use(cors(corsOptions));
  
  

// 👇 poprawne ustawienie preflight

app.use(bodyParser.json());

// Połączenie z MongoDB
mongoose.connect('mongodb://localhost:27017/myapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Błąd połączenia z MongoDB:'));
db.once('open', () => {
  console.log('Połączono z bazą danych MongoDB.');
});

// Schemat użytkownika
const userSchema = new mongoose.Schema({
  username: String,
  password: String
});
const User = mongoose.model('User', userSchema);

// Rejestracja użytkownika
app.post('/api/users', async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Użytkownik już istnieje.' });
    }

    const newUser = new User({ username, password });
    await newUser.save();
    res.status(201).json({ message: 'Utworzono nowego użytkownika.' });
  } catch (error) {
    console.error('Błąd podczas tworzenia użytkownika:', error);
    res.status(500).json({ message: 'Wystąpił błąd podczas tworzenia użytkownika.' });
  }
});

// Logowanie
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user || user.password !== password) {
      return res.status(400).json({ message: 'Nieprawidłowy login lub hasło.' });
    }

    res.status(200).json({ message: 'Zalogowano pomyślnie.' });
  } catch (error) {
    console.error('Błąd podczas logowania:', error);
    res.status(500).json({ message: 'Wystąpił błąd podczas logowania.' });
  }
});

// Start serwera
app.listen(PORT, () => {
  console.log(`Serwer nasłuchuje na porcie ${PORT}.`);
});
