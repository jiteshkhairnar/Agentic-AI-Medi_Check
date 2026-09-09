import { Router } from 'express';
import { CsvMedicineController } from '../controllers/CsvMedicineController';

const router = Router();

// Search medicines from CSV dataset
router.get('/search', CsvMedicineController.search);

// Search by salt/active ingredient
router.get('/salt-search', CsvMedicineController.searchBySalt);

// Get a single medicine by id
router.get('/:id', CsvMedicineController.getById);

// Get all generic alternatives for a medicine (same salt composition)
router.get('/:id/generics', CsvMedicineController.getGenerics);

export default router;
