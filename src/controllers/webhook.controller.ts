import { Request, Response } from 'express';
import { findOrCreateCustomer } from '../services/customer.service';
import { storeMessage } from '../services/message.service';
import { createOrder } from '../services/order.service';
import { extractQuantity } from '../utils/parser';

// WhatsApp Verification
export const verifyWebhook = (req: Request, res: Response): void => {
  /*
  const verify_token = process.env.WHATSAPP_VERIFY_TOKEN;

  const mode = req.query['hub.mode'] as string | undefined;
  const token = req.query['hub.verify_token'] as string | undefined;
  const challenge = req.query['hub.challenge'] as string | undefined;

  if (mode && token) {
    if (mode === 'subscribe' && token === verify_token) {
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  } else {
    res.status(400).send('Missing mode or token');
  }
  */
  res.status(503).send('WhatsApp integration disabled');
};

export const receiveMessage = async (req: Request, res: Response): Promise<void> => {
  /*
  const body = req.body;

  // WhatsApp payload check
  if (body.object === 'whatsapp_business_account') {
    if (
      body.entry &&
      body.entry[0].changes &&
      body.entry[0].changes[0] &&
      body.entry[0].changes[0].value.messages &&
      body.entry[0].changes[0].value.messages[0]
    ) {
      const messageData = body.entry[0].changes[0].value.messages[0];
      const phoneNumber = messageData.from; // Sender phone number
      const text = messageData.text?.body || ''; // Message text

      console.log(`Received message from ${phoneNumber}: ${text}`);

      try {
        // Find or create customer
        const customer = await findOrCreateCustomer(phoneNumber);
        
        // Store message
        const storedMessage = await storeMessage(customer.id, text, body);
        console.log(`Successfully stored message for customer ${customer.id}`);

        // Check for order quantity and create order if found
        const quantity = extractQuantity(text);
        if (quantity) {
          const order = await createOrder(customer.id, storedMessage.id, quantity);
          console.log(`Successfully created pending order ${order.id} for ${quantity} items.`);
        }
      } catch (err) {
        console.error('Failed to process message storage:', err);
      }
    }

    res.sendStatus(200); // Acknowledge receipt to WhatsApp immediately
  } else {
    res.sendStatus(404);
  }
  */
  res.status(503).send('WhatsApp integration disabled');
};
