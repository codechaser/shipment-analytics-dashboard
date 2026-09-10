import { Router } from 'express';
import { ingestCsvController, ingestJsonController, ingestXmlController } from '../controllers/ingestionController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.post('/json', asyncHandler(ingestJsonController));
router.post('/xml', asyncHandler(ingestXmlController));
router.post('/csv', asyncHandler(ingestCsvController));

export default router;
