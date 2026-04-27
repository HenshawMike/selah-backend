import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export const getDashboardData = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Parallel queries for unified state
    const [statsResult, todayResult, ordersResult, customersResult] = await Promise.all([
      // 1. Total Outstanding Summary
      supabase
        .from('orders')
        .select('total_price')
        .eq('status', 'unpaid'),

      // 2. Today's Order Count
      supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today.toISOString()),

      // 3. Paginated Orders (Unified List)
      supabase
        .from('orders')
        .select('*, customers(name, phone), messages(message_text)')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1),

      // 4. Customers Aggregation (for Customers and Debts views)
      supabase
        .from('customers')
        .select('id, name, phone, created_at, orders(total_price, status)')
    ]);

    if (statsResult.error) throw statsResult.error;
    if (todayResult.error) throw todayResult.error;
    if (ordersResult.error) throw ordersResult.error;
    if (customersResult.error) throw customersResult.error;

    // Process Customers and Debts
    const formattedCustomers = (customersResult.data as any[])?.map(c => {
      const orders = (c.orders as any[]) || [];
      const totalDebt = orders
        .filter(o => o.status === 'unpaid')
        .reduce((sum, o) => sum + Number(o.total_price || 0), 0);

      return {
        id: c.id,
        name: c.name || 'New Customer',
        phone: c.phone,
        created_at: c.created_at,
        total_orders: orders.length,
        total_debt: totalDebt,
        unpaid_orders_count: orders.filter(o => o.status === 'unpaid').length
      };
    }) || [];

    const totalOutstanding = statsResult.data?.reduce((sum, o) => sum + Number(o.total_price || 0), 0) || 0;

    res.json({
      summary: {
        totalDebt: totalOutstanding,
        unpaidCount: statsResult.data?.length || 0,
        todayCount: todayResult.count || 0
      },
      orders: ordersResult.data || [],
      customers: formattedCustomers,
      debts: formattedCustomers.filter(c => c.total_debt > 0),
      pagination: {
        page,
        hasMore: (ordersResult.data?.length || 0) === limit
      }
    });
  } catch (err) {
    console.error('Unified Dashboard Error:', err);
    res.status(500).json({ error: 'Failed to fetch unified dashboard data' });
  }
};

export const deleteOrder = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const { error } = await supabase.from('orders').delete().eq('id', id);
    if (error) throw error;
    res.sendStatus(200);
  } catch (err) {
    console.error('Delete Order Error:', err);
    res.status(500).json({ error: 'Failed to delete order' });
  }
};

export const confirmOrder = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { quantity, unit_price } = req.body;
  const total_price = quantity * unit_price;

  try {
    const { error } = await supabase
      .from('orders')
      .update({
        quantity,
        unit_price,
        total_price,
        status: 'unpaid'
      })
      .eq('id', id);

    if (error) throw error;
    res.sendStatus(200);
  } catch (err) {
    console.error('Confirm Order Error:', err);
    res.status(500).json({ error: 'Failed to confirm order' });
  }
};

export const createManualOrder = async (req: Request, res: Response) => {
  const { phone, name, quantity, unit_price } = req.body;

  try {
    // 1. Find or Create Customer
    let { data: customer, error: findError } = await supabase
      .from('customers')
      .select('*')
      .eq('phone', phone)
      .maybeSingle();

    if (findError) throw findError;

    if (!customer) {
      // Create new customer
      const { data: newCustomer, error: createError } = await supabase
        .from('customers')
        .insert([{ phone, name: name || 'Unknown' }])
        .select()
        .single();
      if (createError) throw createError;
      customer = newCustomer;
    } else if (!customer.name || customer.name === 'Unknown') {
      // Update name only if it was empty/Unknown
      if (name) {
        await supabase
          .from('customers')
          .update({ name })
          .eq('id', customer.id);
      }
    }

    // 2. Fetch default price if not provided
    let finalUnitPrice = unit_price;
    if (!finalUnitPrice) {
      const { data: dist } = await supabase
        .from('distributors')
        .select('default_price')
        .limit(1)
        .single();
      finalUnitPrice = dist?.default_price;
    }

    // 3. Create Order
    const { error: orderError } = await supabase
      .from('orders')
      .insert([{
        customer_id: customer.id,
        quantity,
        unit_price: finalUnitPrice,
        total_price: quantity * finalUnitPrice,
        status: 'unpaid'
      }]);

    if (orderError) throw orderError;

    res.sendStatus(201);
  } catch (err) {
    console.error('Manual Order Error:', err);
    res.status(500).json({ error: 'Failed to create manual order' });
  }
};
export const updateOrderStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id);

    if (error) throw error;
    res.sendStatus(200);
  } catch (err) {
    console.error('Update Order Status Error:', err);
    res.status(500).json({ error: 'Failed to update order status' });
  }
};
