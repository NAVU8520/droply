const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));
app.use(express.json());

const authRoutes = require('./src/routes/auth');
const productRoutes = require('./src/routes/products');

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

app.get('/', (req, res) => {
  res.send('Price Drop Alert API is running');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
