const mongoose = require('mongoose');

const ATLAS_URI = 'mongodb+srv://julianafranka7_db_user:b6D08i7WrDqvElI2@cluster0.pcyrcg7.mongodb.net/multivendor?retryWrites=true&w=majority';

const connectDB = async () => {
  let uri = process.env.MONGO_URI;

  // Auto-correct missing or incomplete cluster domain
  if (!uri || uri.includes('127.0.0.1') || uri.includes('localhost') || uri.includes('@cluster0.mongodb.net') || uri.includes('<db_password>')) {
    uri = ATLAS_URI;
  } else if (uri.includes('cluster0.mongodb.net') && !uri.includes('cluster0.pcyrcg7.mongodb.net')) {
    uri = uri.replace('cluster0.mongodb.net', 'cluster0.pcyrcg7.mongodb.net');
  }

  try {
    const conn = await mongoose.connect(uri, { autoIndex: true });
    console.log(`[Database] MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`[Database Error] ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
