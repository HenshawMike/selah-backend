import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import webhookRoutes from './routes/webhook.routes';
import dashboardRoutes from './routes/dashboard.routes';
import customerRoutes from './routes/customer.routes';
import settingsRoutes from './routes/settings.routes';

// Load environment variables
dotenv.config(); // Default behavior: looks for .env in the current working directory
// Fallback for local development if .env is in the root Selah directory
if (!process.env.SUPABASE_URL) {
  dotenv.config({ path: path.resolve(__dirname, '../../.env') });
}

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'selah-backend' });
});

app.use('/webhook', webhookRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/settings', settingsRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); // Security config reloaded
