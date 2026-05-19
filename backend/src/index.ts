import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

import { reportRouter } from './routes/report';
import { pptRouter } from './routes/ppt';

dotenv.config();

export const prisma = new PrismaClient();

const app = express();

const port = process.env.PORT || 10000;

/* Middleware */
app.use(cors());
app.use(express.json());

/* Root Route */
app.get('/', (req, res) => {
  res.json({
    message: 'Video Competitor Intelligence API Running'
  });
});

/* Health Check */
app.get('/health', (req, res) => {
  res.json({
    status: 'ok'
  });
});

/* API Routes */
app.use('/api/report', reportRouter);
app.use('/api/ppt', pptRouter);

/* Start Server */
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});