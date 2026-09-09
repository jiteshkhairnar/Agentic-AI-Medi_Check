import { Router } from 'express';
import { PharmacistController } from '../controllers/PharmacistController';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/rbac.middleware';

const router = Router();

// Apply auth and RBAC to all pharmacist routes
router.use(authenticate);
router.use(authorize(['medical_store', 'super_admin', 'platform_admin']));

router.get('/prescriptions', PharmacistController.getPrescriptions);
router.patch('/inventory/:id/stock', PharmacistController.updateStock);
router.post('/dispense', PharmacistController.dispense);

export default router;
