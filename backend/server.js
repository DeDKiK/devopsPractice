import express from 'express';
import path from 'path';
import { MongoClient } from 'mongodb'; // Зверни увагу на фігурні дужки
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import cors from 'cors';

const app = express();
const port = 3000;

// Оскільки ти використовуєш ES Modules (import), __dirname потрібно визначити так:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(bodyParser.json());

// 1. Налаштування підключення до бази
// Використовуємо твої дані: luna, password, назва контейнера mongodb
const url = 'mongodb://luna:password@localhost:27017';
const client = new MongoClient(url);
const dbName = 'user-acc'; // Назва твоєї бази даних

async function connectDB() {
    try {
        await client.connect();
        console.log('✅ Connected successfully to MongoDB');
    } catch (e) {
        console.error('❌ Connection error:', e);
    }
}

connectDB();

// 2. Роути
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Приклад: Отримання профілю користувача з бази
app.get('/get-profile', async (req, res) => {
    const db = client.db(dbName);
    const collection = db.collection('users');
    
    const user = await collection.findOne({ id: 1 });
    res.send(user || {});
});

// Приклад: Оновлення профілю
app.post('/update-profile', async (req, res) => {
    const userObj = req.body;
    const db = client.db(dbName);
    const collection = db.collection('users');

    await collection.updateOne({ id: 1 }, { $set: userObj }, { upsert: true });
    res.send({ message: "Profile updated successfully!" });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});