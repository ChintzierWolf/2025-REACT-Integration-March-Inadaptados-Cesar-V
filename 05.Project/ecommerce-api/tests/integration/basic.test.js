import request from 'supertest';
import app from '../../app.js';

describe('Basic API Tests', () => {
  it('should return 200 for root route', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.text).toBe('WELCOME!');
  });

  it('should return 404 for unknown routes', async () => {
    const res = await request(app).get('/unknown');
    expect(res.status).toBe(404);
  });
});
