import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export const updateCustomer = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const { error } = await supabase
      .from('customers')
      .update({ name })
      .eq('id', id);

    if (error) throw error;
    res.sendStatus(200);
  } catch (err) {
    console.error('Update Customer Error:', err);
    res.status(500).json({ error: 'Failed to update customer' });
  }
};

export const deleteCustomer = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.sendStatus(200);
  } catch (err) {
    console.error('Delete Customer Error:', err);
    res.status(500).json({ error: 'Failed to delete customer' });
  }
};

export const bulkDeleteCustomers = async (req: Request, res: Response) => {
  const { ids } = req.body;
  try {
    const { error } = await supabase
      .from('customers')
      .delete()
      .in('id', ids);

    if (error) throw error;
    res.sendStatus(200);
  } catch (err) {
    console.error('Bulk Delete Customers Error:', err);
    res.status(500).json({ error: 'Failed to bulk delete customers' });
  }
};
