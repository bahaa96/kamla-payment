import "reflect-metadata";
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import paymentRoutes from './routes/payment.routes';
import typeformRoutes from './routes/typeform.routes';
import submissionRoutes from './routes/submission.routes';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors()); // Enable CORS for all origins

// Serve static files from the public directory
app.use('/public', express.static(path.join(__dirname, '../public'), {
  maxAge: '1d', // Cache for 1 day
  etag: true,   // Enable ETags
  lastModified: true, // Enable Last-Modified
  immutable: true, // For files that never change
  cacheControl: true, // Enable Cache-Control
  setHeaders: (res, path) => {
    // Add extra headers for specific file types
    if (path.endsWith('.css') || path.endsWith('.js')) {
      res.setHeader('Cache-Control', 'public, max-age=86400'); // 1 day in seconds
    } else if (path.match(/\.(jpg|jpeg|png|gif|ico|svg)$/i)) {
      res.setHeader('Cache-Control', 'public, max-age=2592000'); // 30 days in seconds
    }
  }
}));

// Routes
app.use('/api', paymentRoutes);
app.use('/api', submissionRoutes);
app.use('/typeform', typeformRoutes);

// Health check endpoint
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'An unexpected error occurred'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server ready on port ${PORT}.`));

export default app;