import { Router } from 'express';
import { generateReport, getReport } from '../controllers/report.controller';

export const reportRouter = Router();

reportRouter.post('/generate', generateReport);
reportRouter.get('/:id', getReport);
