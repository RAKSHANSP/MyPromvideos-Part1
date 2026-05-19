import { Router } from 'express';
import { generatePPT } from '../controllers/ppt.controller';

export const pptRouter = Router();

pptRouter.get('/:id', generatePPT);
