import { supabase } from '../config/supabase';

export const storeMessage = async (customerId: string, text: string, rawPayload: any) => {
  const { data: newMessage, error } = await supabase
    .from('messages')
    .insert([{
      customer_id: customerId,
      message_text: text,
      raw_payload: rawPayload
    }])
    .select('id, message_text, created_at')
    .single();

  if (error) {
    throw new Error(`Error storing message: ${error.message}`);
  }

  return newMessage;
};
