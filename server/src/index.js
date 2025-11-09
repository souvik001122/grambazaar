const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

dotenv.config();

const shopRoutes = require('./routes/shops');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const addressRoutes = require('./routes/addresses');
const authRoutes = require('./routes/auth');
const devRoutes = require('./routes/dev');

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => res.send({ message: 'GramBazaar API' }));

app.use('/api/shops', shopRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/auth', authRoutes);
app.use('/dev', devRoutes);

// error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).send({ error: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 5000;
async function start() {
  let uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log('No MONGODB_URI found — starting in-memory MongoDB for local dev')
    const mongod = await MongoMemoryServer.create();
    uri = mongod.getUri();
  }
  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB connected');
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log('Server listening on', PORT, 'pid:', process.pid);
    });
    server.on('listening', () => {
      const addr = server.address();
      console.log('Address info:', addr);
    });
  } catch (err) {
    console.error('DB connection error', err);
    process.exit(1);
  }
}

start()
