import { Router } from 'express';
import { AdminController } from '../controllers/AdminController';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/rbac.middleware';

const router = Router();

router.use(authenticate);
router.use(authorize(['super_admin', 'platform_admin', 'security_officer']));

router.get('/users', AdminController.getUsers);
router.get('/discrepancies', AdminController.getDiscrepancies);
router.patch('/discrepancies/:id/triage', AdminController.triage);

export default router;
