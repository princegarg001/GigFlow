import express from 'express';
import cors from 'cors';
import 'express-async-errors';

import authRoutes from './routes/auth.routes';
import leadsRoutes from './routes/leads.routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Core middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'Smart Leads API is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadsRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler — must be last
app.use(errorHandler);

export default app;
