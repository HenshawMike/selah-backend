import { Router } from 'express';
import { updateCustomer, deleteCustomer, bulkDeleteCustomers } from '../controllers/customer.controller';

const router = Router();

router.put('/:id', updateCustomer);
router.delete('/:id', deleteCustomer);
router.post('/bulk-delete', bulkDeleteCustomers);

export default router;
