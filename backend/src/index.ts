import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { reportRouter } from './routes/report';
import { pptRouter } from './routes/ppt';

dotenv.config();

export const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/report', reportRouter);
app.use('/api/ppt', pptRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
