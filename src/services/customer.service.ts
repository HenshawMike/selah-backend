import { supabase } from '../config/supabase';

export const findOrCreateCustomer = async (phone: string) => {
  // Try to find existing customer
  const { data: existingCustomer, error: findError } = await supabase
    .from('customers')
    .select('id, phone, name')
    .eq('phone', phone)
    .single();

  if (findError && findError.code !== 'PGRST116') {
    // PGRST116 means no rows returned (which is expected for a new customer)
    throw new Error(`Error finding customer: ${findError.message}`);
  }

  if (existingCustomer) {
    return existingCustomer;
  }

  // Create new customer if not found
  const { data: newCustomer, error: createError } = await supabase
    .from('customers')
    .insert([{ phone }])
    .select('id, phone, name')
    .single();

  if (createError) {
    throw new Error(`Error creating customer: ${createError.message}`);
  }

  return newCustomer;
};
