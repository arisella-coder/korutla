import mongoose from 'mongoose';
import { config } from 'dotenv';

config();

// Cache for service-specific connections
const connections = {};
const baseUri = process.env.DATABASE;

if (!baseUri) {
  console.error('DATABASE environment variable is not defined.');
  process.exit(1);
}

// Build connection string for a specific service using the URL API
function buildConnectionString(serviceName) {
  try {
    const urlObj = new URL(baseUri);
    // Replace or add the database name in the pathname
    urlObj.pathname = `/${serviceName}`;
    return urlObj.toString();
  } catch (error) {
    console.error('Failed to parse DATABASE URI:', error);
    throw error;
  }
}

// Connect to the default database using the provided baseUri
async function connectDefault() {
  try {
    await mongoose.connect(baseUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: process.env.DB_MAX_POOL_SIZE || 10,
    });
    console.log('Connected to default MongoDB database');
    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to default database:', error);
    throw error;
  }
}

// Connect to a specific service database, reusing connection if it exists
async function connectToService(serviceName) {
  if (connections[serviceName]) {
    return connections[serviceName];
  }
  try {
    const connectionString = buildConnectionString(serviceName);
    console.log(`Connecting to ${serviceName} database`);

    const connection = mongoose.createConnection(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: process.env.DB_MAX_POOL_SIZE || 10,
    });

    connection.on('connected', () =>
      console.log(`Mongoose connected to ${serviceName} database`)
    );
    connection.on('error', (err) =>
      console.error(`Mongoose connection error on ${serviceName} database:`, err)
    );

    connections[serviceName] = connection;
    return connection;
  } catch (error) {
    console.error(`Failed to connect to ${serviceName} database:`, error);
    throw error;
  }
}

// Retrieve a connection (creates one if it doesn't exist)
async function getConnection(serviceName) {
  if (!connections[serviceName]) {
    await connectToService(serviceName);
  }
  return connections[serviceName];
}

// Close all connections gracefully
async function closeAll() {
  try {
    await mongoose.disconnect();
    for (const [name, connection] of Object.entries(connections)) {
      await connection.close();
      console.log(`Closed connection to ${name} database`);
    }
    Object.keys(connections).forEach((key) => delete connections[key]);
  } catch (error) {
    console.error('Error during closing connections:', error);
  }
}

export default {
  connectDefault,
  connectToService,
  getConnection,
  closeAll,
};
