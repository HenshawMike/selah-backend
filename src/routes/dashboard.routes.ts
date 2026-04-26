import { Router } from 'express';
import { getDashboardData, deleteOrder, confirmOrder, createManualOrder } from '../controllers/dashboard.controller';

const router = Router();

router.get('/', getDashboardData);
router.delete('/orders/:id', deleteOrder);
router.post('/orders/:id/confirm', confirmOrder);
router.post('/orders/manual', createManualOrder);

export default router;
