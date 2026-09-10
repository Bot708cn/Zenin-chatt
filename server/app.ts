import express from 'express';
import { apiRouter } from './api.ts';

export const serverApp = express();

serverApp.use(express.json({ limit: '10mb' }));
serverApp.use(express.urlencoded({ extended: true }));

// Health check
serverApp.get(['/health', '/api/health'], (_req, res) => {
  res.json({ status: 'ok', name: 'Zenin Chatt API', time: new Date().toISOString() });
});

// Mount the API router for both direct /api prefix and stripped / prefix
serverApp.use('/api', apiRouter);
serverApp.use(apiRouter);

export default serverApp;


