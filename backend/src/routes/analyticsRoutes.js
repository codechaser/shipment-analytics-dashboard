import { Router } from 'express';
import { analyticsSummaryController } from '../controllers/analyticsController.js';

const router = Router();

router.get('/summary', analyticsSummaryController);

export default router;
