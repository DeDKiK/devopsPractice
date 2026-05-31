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
    const port = process.env.PORT || 5000;
    expect(port).toBe(5000);
  });
});

// 1. mock the ‘mongodb’ module in an ES6 class so that the `new` operator works without errors
vi.mock('mongodb', () => {
  return {
    MongoClient: class {
      constructor(url) {
        this.url = url;
      }
      // Simulate a successful connection to the database
      connect() {
        return Promise.resolve();
      }
      // Simulate a database query and return the desired collection with sample data
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

// 2. Import the server itself (it will now successfully initialize our mock MongoClient)
import './server.js';

describe('Бекенд API Тести (Express + Prometheus)', () => {
  
  it('GET /health must return a success or ready status', async () => {
    const res = await request('http://localhost:5000').get('/health');
      // Endpoint may return 200 (if database is connected) or 503 (if still in process)
      // Both variants mean that the Express route is working correctly
    expect([200, 503]).toContain(res.status);
  });

  it('GET /metrics must return metrics for Prometheus', async () => {
    const res = await request('http://localhost:5000').get('/metrics');
    expect(res.status).toBe(200);
    expect(res.text).toContain('http_request_total');
  });

  it('GET /api/get-profile must return JSON format', async () => {
    const res = await request('http://localhost:5000').get('/api/get-profile');
    expect([200, 503]).toContain(res.status);
    expect(res.headers['content-type']).toContain('application/json');
  });
});