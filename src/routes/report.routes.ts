import { Router } from 'express';
import { reportController } from '../controllers/report.controller';

const router = Router();

// POST /api/reports - Create Report
router.post('/', (req, res, next) => reportController.createReport(req, res, next));

// GET /api/reports - Get Reports
router.get('/', (req, res, next) => reportController.getReports(req, res, next));

// PATCH /api/reports/:id/status - Approve or Reject Report
router.patch('/:id/status', (req, res, next) => reportController.updateReportStatus(req, res, next));

export default router;
