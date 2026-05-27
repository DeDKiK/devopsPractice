import { describe, it, expect } from 'vitest';

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