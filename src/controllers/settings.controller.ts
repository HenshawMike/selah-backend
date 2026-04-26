import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export const getSettings = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('distributors')
      .select('default_price')
      .limit(1)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('Get Settings Error:', err);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
};

export const updateSettings = async (req: Request, res: Response) => {
  const { default_price } = req.body;
  try {
    // For single-user MVP, we just update the first row
    const { data: dist, error: fetchError } = await supabase
      .from('distributors')
      .select('id')
      .limit(1)
      .single();
    
    if (fetchError) throw fetchError;

    const { error } = await supabase
      .from('distributors')
      .update({ default_price })
      .eq('id', dist.id);

    if (error) throw error;
    res.sendStatus(200);
  } catch (err) {
    console.error('Update Settings Error:', err);
    res.status(500).json({ error: 'Failed to update settings' });
  }
};
