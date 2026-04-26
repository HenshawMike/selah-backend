import { supabase } from '../config/supabase';

export const createOrder = async (customerId: string, messageId: string, quantity: number) => {
  const { data: newOrder, error } = await supabase
    .from('orders')
    .insert([{
      customer_id: customerId,
      source_message_id: messageId,
      quantity,
      unit_price: null,
      total_price: null,
      status: 'draft'
    }])
    .select('id, quantity, status')
    .single();

  if (error) {
    throw new Error(`Error creating order: ${error.message}`);
  }

  return newOrder;
};
