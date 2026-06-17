import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import complaintRoutes from './routes/complaintRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend/ directory (works from any cwd)
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

console.log('--- Startup Environment Verification ---');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'LOADED' : 'MISSING');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'LOADED' : 'MISSING');
console.log('CLIENT_URL:', process.env.CLIENT_URL ? 'LOADED' : 'MISSING');
console.log('----------------------------------------');

await connectDB();

const app = express();

// Security Middlewares
app.use(helmet({
  contentSecurityPolicy: false, // Disabled for Render/Cloudinary images in MVP
}));
app.use(mongoSanitize());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use('/api', limiter); // Apply rate limiter to API routes only

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173'
  })
);
// We can reduce JSON limit to 50mb since we need to accept base64 from frontend before sending to Cloudinary
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(morgan('dev'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Smart Waste Management API is running.' });
});

app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/feedback', feedbackRoutes);

if (process.env.NODE_ENV === 'production') {
  const frontendDist = path.resolve(__dirname, '../../frontend/dist');
  app.use(express.static(frontendDist));

  app.get('*', (req, res) =>
    res.sendFile(path.join(frontendDist, 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('API is running...');
  });
}

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
