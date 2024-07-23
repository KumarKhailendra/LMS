import mongoose, { ConnectOptions, Connection } from 'mongoose';

const connectDB = (): void => {
  const options: ConnectOptions = {
    serverSelectionTimeoutMS: 30000,
    maxPoolSize: 50,
    socketTimeoutMS: 60000,
    family: 4
  };
  
  const mongoURL = process.env.MONGODB_URL || '';
  
  mongoose.connect(mongoURL, options);
  const db: Connection = mongoose.connection;
    
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));
  db.once('open', () => {
    console.log('Connected to MongoDB');
  });
}

export default connectDB;
