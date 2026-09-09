import { Router } from 'express';
import { MedicineController } from '../controllers/MedicineController';

const router = Router();

router.get('/search', MedicineController.search);
router.get('/:id/substitutes/janaushadhi', MedicineController.getJanAushadhi);
router.get('/breaches', MedicineController.getBreaches);

export default router;
