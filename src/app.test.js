import { describe, it, expect, vi, beforeEach } from 'vitest';

// 1. mocking the 'fetch' function globally to simulate API calls in frontend tests
vi.stubGlobal('fetch', vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ id: 1, name: 'ss ass', role: 'Junior DevOps / Front-end' }),
  })
));

describe('Frontend Tests (React + Vite)', () => {
  
  beforeEach(() => {
    // clear mocks before each test to ensure clean state
    vi.clearAllMocks();
  });

  it('Checking the functionality of the Vitest testing environment', () => {
    expect(true).toBe(true);
  });

  it('Profile data retrieval (API Fetch) logic works correctly', async () => {
    // called fetch to get profile data
    const response = await fetch('/api/get-profile');
    const data = await response.json();
    
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(response.ok).toBe(true);
    expect(data.name).toBe('ss ass');
    expect(data.role).toContain('DevOps');
  });

  it('API path formatting function works correctly', () => {
    // basic function to format API paths, can be expanded as needed
    const baseUrl = '';
    const getFullUrl = (endpoint) => `${baseUrl}${endpoint}`;
    
    expect(getFullUrl('/api/get-profile')).toBe('/api/get-profile');
  });
});