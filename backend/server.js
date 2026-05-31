import express from 'express';
import path from 'path';
import { MongoClient } from 'mongodb';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import cors from 'cors';
import prometheus from 'prom-client';

const app = express();
const port = 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ====================== PROMETHEUS ======================
const register = new prometheus.Registry();

prometheus.collectDefaultMetrics({ register });

const httpRequestTotal = new prometheus.Counter({
  name: 'http_request_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status'],
  registers: [register]
});

const httpRequestDuration = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route'],
  registers: [register],
})



//Middleware 

app.use((req, res, next) => {
  const end = httpRequestDuration.startTimer();
  res.on('finish', () => {
    httpRequestTotal.inc({
      method: req.method,
      route: req.route?.path || req.path,
      status: res.statusCode
    })
    end({ method: req.method, route: req.route?.path || req.path });
  })
  next();
})



app.get('/metrics', async (req,res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics())
  } catch (err) {
    res.status(500).end(err.message);
  }
})

app.use(cors({
  origin: '*',
  credentials: false
}));

app.use(bodyParser.json());


const url = process.env.MONGO_URL || 'mongodb://mongo.devops-practice.svc.cluster.local:27017/test';
const client = new MongoClient(url);

let dbConnected = false;

async function connectDB() {
  try {
    await client.connect();
    dbConnected = true;
    console.log('✅ Connected successfully to MongoDB');
    console.log(`📊 Using connection: ${url}`);
  } catch (e) {
    dbConnected = false;
    console.error('❌ MongoDB Connection error:', e);
    process.exit(1);
  }
}

// Start server only after DB connection
connectDB().then(() => {
  app.listen(port, '0.0.0.0', () => {
    console.log(`✅ Backend running at http://0.0.0.0:${port}`);
  });
}).catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

// API Routes
app.get('/api/get-profile', async (req, res) => {
  try {
    if (!dbConnected) {
      return res.status(503).json({ error: 'Database not connected' });
    }
    const db = client.db('test');           
    const collection = db.collection('users');
    const user = await collection.findOne({ id: 1 });
    res.json(user || {});
  } catch (err) {
    console.error('❌ Error getting profile:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

app.post('/api/update-profile', async (req, res) => {
  try {
    if (!dbConnected) {
      return res.status(503).json({ error: 'Database not connected' });
    }
    const userObj = req.body;
    
    // ВИДАЛЯЄМО _id перед оновленням, щоб MongoDB не сварилася
    if (userObj._id) {
      delete userObj._id;
    }

    console.log('📝 Updating profile with:', userObj);
    const db = client.db('test');           
    const collection = db.collection('users');

    const result = await collection.updateOne(
      { id: 1 },
      { $set: userObj },
      { upsert: true }
    );

    console.log('✅ Update result:', result);
    res.json({ message: "Profile updated successfully!" });
  } catch (err) {
    console.error('❌ Error updating profile:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    mongo: 'connected',
    uptime: process.uptime()
  });
});