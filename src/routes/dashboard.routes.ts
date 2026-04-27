import { Router } from 'express';
import { getDashboardData, deleteOrder, confirmOrder, createManualOrder, updateOrderStatus } from '../controllers/dashboard.controller';

const router = Router();

router.get('/', getDashboardData);
router.delete('/orders/:id', deleteOrder);
router.post('/orders/:id/confirm', confirmOrder);
router.patch('/orders/:id/status', updateOrderStatus);
router.post('/orders/manual', createManualOrder);

export default router;
