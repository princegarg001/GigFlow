import { Router } from 'express';
import * as ctrl from '../controllers/leadsController';
import { protect } from '../middleware/auth';
import { authorize } from '../middleware/rbac';
import { validateBody } from '../middleware/validate';
import { createLeadSchema, updateLeadSchema } from '../validators/lead.validator';

const router = Router();

// All lead routes require a valid JWT
router.use(protect);

// Public (authenticated)
router.get('/stats', ctrl.getStats);
router.get('/', ctrl.getLeads);
router.get('/export', ctrl.exportLeads);
router.get('/:id', ctrl.getLead);

// Admin only
router.post('/', authorize('admin'), validateBody(createLeadSchema), ctrl.createLead);
router.put('/:id', authorize('admin'), validateBody(updateLeadSchema), ctrl.updateLead);
router.delete('/:id', authorize('admin'), ctrl.deleteLead);

export default router;
