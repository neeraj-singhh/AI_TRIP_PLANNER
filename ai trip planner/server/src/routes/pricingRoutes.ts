import { Router } from 'express';
import { quotePricing } from '../controllers/pricingController';

const router = Router();

router.post('/quote', quotePricing);

export default router;

