import express from 'express';
import path from 'path';
import { MongoClient } from 'mongodb';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import cors from 'cors';
import prometheus from 'prom-client';

const app = express();
const port = 3000;

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
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));

app.use(bodyParser.json());


const url = process.env.MONGO_URL || 'mongodb://mongo:27017/test';
const client = new MongoClient(url);

async function connectDB() {
  try {
    await client.connect();
    console.log('✅ Connected successfully to MongoDB');
    console.log(`📊 Using connection: ${url}`);
  } catch (e) {
    console.error('❌ MongoDB Connection error:', e);
  }
}

connectDB();

// API Routes
app.get('/api/get-profile', async (req, res) => {
  try {
    const db = client.db('test');           
    const collection = db.collection('users');
    const user = await collection.findOne({ id: 1 });
    res.json(user || {});
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/update-profile', async (req, res) => {
  try {
    const userObj = req.body;
    const db = client.db('test');           
    const collection = db.collection('users');

    await collection.updateOne(
      { id: 1 },
      { $set: userObj },
      { upsert: true }
    );

    res.json({ message: "Profile updated successfully!" });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`✅ Backend running at http://0.0.0.0:${port}`);
});