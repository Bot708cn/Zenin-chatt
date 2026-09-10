import express from 'express';
import { apiRouter } from './api.js';

export const serverApp = express();

serverApp.use(express.json({ limit: '10mb' }));
serverApp.use(express.urlencoded({ extended: true }));

// Mount the API router
serverApp.use('/api', apiRouter);

// Health check
serverApp.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', name: 'Zenin Chatt API', time: new Date().toISOString() });
});
