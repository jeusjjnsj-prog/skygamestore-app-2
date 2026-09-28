import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.resolve(process.cwd(), 'data', 'store_data.json');

// Ensure data folder and storage file exist
function loadStoreData(): { productImages: Record<string, string>; qrImage: string | null } {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error loading store data:', err);
  }
  return { productImages: {}, qrImage: null };
}

function saveStoreData(data: { productImages: Record<string, string>; qrImage: string | null }) {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving store data:', err);
  }
}

let currentStoreData = loadStoreData();

// Increase payload limit to support high-resolution base64 images
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Active SSE client connections for real-time live synchronization
const sseClients = new Set<Response>();

function broadcastStoreUpdate() {
  const payload = `data: ${JSON.stringify({ type: 'sync', data: currentStoreData })}\n\n`;
  for (const client of sseClients) {
    try {
      client.write(payload);
    } catch {
      sseClients.delete(client);
    }
  }
}

// 1. GET /api/store-data -> Fetch all images and store config
app.get('/api/store-data', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: currentStoreData,
  });
});

// 2. POST /api/product-images -> Admin updates or resets product image
app.post('/api/product-images', (req: Request, res: Response) => {
  const { productId, dataUrl } = req.body;
  if (!productId) {
    return res.status(400).json({ success: false, error: 'Product ID is required' });
  }

  if (dataUrl) {
    currentStoreData.productImages[productId] = dataUrl;
  } else {
    delete currentStoreData.productImages[productId];
  }

  saveStoreData(currentStoreData);
  broadcastStoreUpdate();

  res.json({
    success: true,
    productId,
    hasImage: Boolean(dataUrl),
    productImages: currentStoreData.productImages,
  });
});

// 3. POST /api/store-qr -> Admin updates custom ABA KHQR image
app.post('/api/store-qr', (req: Request, res: Response) => {
  const { qrImage } = req.body;
  currentStoreData.qrImage = qrImage || null;

  saveStoreData(currentStoreData);
  broadcastStoreUpdate();

  res.json({
    success: true,
    qrImage: currentStoreData.qrImage,
  });
});

// 4. POST /api/auth/verify-admin -> Strictly verifies Master Admin credentials on server side
app.post('/api/auth/verify-admin', (req: Request, res: Response) => {
  const { phone, password } = req.body;
  let cleanPhone = (phone || '').replace(/[\s-+]/g, '');
  if (cleanPhone.startsWith('855')) cleanPhone = '0' + cleanPhone.slice(3);
  const cleanPass = (password || '').trim();

  const MASTER_ADMIN_PHONE = '0969749477';
  const MASTER_ADMIN_PASSWORDS = [
    'PakSeyha200815@11',
    '< PakSeyha200815@11',
    '<PakSeyha200815@11'
  ];

  if (cleanPhone === MASTER_ADMIN_PHONE && MASTER_ADMIN_PASSWORDS.includes(cleanPass)) {
    return res.json({ success: true, isAdmin: true });
  }

  return res.json({ success: false, isAdmin: false });
});

// 5. GET /api/live-sync -> Server-Sent Events (SSE) for zero-latency live sync for all visitors
app.get('/api/live-sync', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  // Send initial data to this client
  res.write(`data: ${JSON.stringify({ type: 'init', data: currentStoreData })}\n\n`);

  sseClients.add(res);

  // Keep alive ping
  const interval = setInterval(() => {
    try {
      res.write(': keepalive\n\n');
    } catch {
      clearInterval(interval);
      sseClients.delete(res);
    }
  }, 25000);

  req.on('close', () => {
    clearInterval(interval);
    sseClients.delete(res);
  });
});

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    // Mount Vite middleware in development
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve production static assets
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`SkyPro Store Full-Stack server running on port ${PORT}`);
  });
}

startServer();
