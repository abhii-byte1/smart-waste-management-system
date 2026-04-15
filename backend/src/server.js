import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import complaintRoutes from './routes/complaintRoutes.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

dotenv.config();
await connectDB();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173'
  })
);
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));
app.use(morgan('dev'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Smart Waste Management API is running.' });
});

app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
