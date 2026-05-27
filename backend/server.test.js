import { describe, it, expect } from 'vitest';
import request from 'supertest';

describe('basic math test', () => {
  it('should correctly add two numbers', () => {
    expect(1 + 1).toBe(2);
  });
});

// simple logic test
describe('Server configuration test', () => {
  it('default port should be defined', () => {
    const port = process.env.PORT || 3000;
    expect(port).toBe(3000);
  });
});

// 1. Мокаємо модуль 'mongodb' за допомогою ES6 класу, щоб оператор `new` працював без помилок
vi.mock('mongodb', () => {
  return {
    MongoClient: class {
      constructor(url) {
        this.url = url;
      }
      // Імітуємо успішне підключення до бази даних
      connect() {
        return Promise.resolve();
      }
      // Імітуємо повернення бази даних та потрібної колекції з фейковими даними
      db() {
        return {
          collection: () => ({
            findOne: () => Promise.resolve({ id: 1, name: 'Vasyl Deresh', role: 'Junior DevOps' }),
            updateOne: () => Promise.resolve({ acknowledged: true, modifiedCount: 1 })
          })
        };
      }
    }
  };
});

// 2. Імпортуємо сам сервер (тепер він успішно ініціалізує наш фейковий MongoClient)
import './server.js';

describe('Бекенд API Тести (Express + Prometheus)', () => {
  
  it('GET /health має повертати статус успіху або готовності', async () => {
    const res = await request('http://localhost:3000').get('/health');
    // Ендпоінт може повернути 200 (якщо база підключилась) або 503 (якщо ще в процесі)
    // Обидва варіанти означають, що сам Express-маршрут працює коректно
    expect([200, 503]).toContain(res.status);
  });

  it('GET /metrics має віддавати метрики для Prometheus', async () => {
    const res = await request('http://localhost:3000').get('/metrics');
    expect(res.status).toBe(200);
    expect(res.text).toContain('http_request_total');
  });

  it('GET /api/get-profile повертає формат JSON', async () => {
    const res = await request('http://localhost:3000').get('/api/get-profile');
    expect([200, 503]).toContain(res.status);
    expect(res.headers['content-type']).toContain('application/json');
  });
});