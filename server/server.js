//server.js
import express from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import dbManager from './config/db.js';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/product.js';
import cookieParser from 'cookie-parser';

config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({
  origin: 'http://localhost:5173', // update with your frontend domain
  credentials: true,
}));
app.use(express.json());

app.use(cookieParser());

// List of service-specific databases to connect to
const services = ['product', 'order', 'cart'];

// Initialize database connections
async function initializeDatabases() {
  try {
    await dbManager.connectDefault();

    const connectionEntries = await Promise.all(
      services.map(async (service) => {
        const connection = await dbManager.connectToService(service);
        return [service, connection];
      })
    );

    console.log('All service-specific databases are connected.');
    return Object.fromEntries(connectionEntries);
  } catch (error) {
    console.error('Failed to initialize databases:', error);
    process.exit(1);
  }
}

initializeDatabases()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server listening at http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Server startup aborted due to database connection error:', error);
    process.exit(1);
  });

// Basic route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down server...');
  await dbManager.closeAll();
  process.exit(0);
});
