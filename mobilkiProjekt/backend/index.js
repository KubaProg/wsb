const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const transactionsRoutes = require('./routes/transactions');
const subscribeRoutes = require('./routes/subscribe');
const budgetRoutes = require('./routes/budget');

const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/transactions', transactionsRoutes);
app.use('/api/subscribe', subscribeRoutes);
app.use('/api/budget', budgetRoutes);

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/finance-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
