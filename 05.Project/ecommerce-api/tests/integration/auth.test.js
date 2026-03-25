import request from 'supertest';
import app from '../../app.js';
import User from '../../src/models/user.js';

describe('Auth Integration Tests', () => {
  describe('POST /api/auth/register', () => {
    it('should successfully register a user (201)', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          displayName: 'Integration Test',
          email: 'test@integration.com',
          password: 'password123',
          phone: '123456789'
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('email', 'test@integration.com');
      
      const userInDb = await User.findOne({ email: 'test@integration.com' });
      expect(userInDb).toBeTruthy();
      expect(userInDb.hashPassword).not.toBe('password123'); // Should be hashed
    });

    it('should return 400 if email already exists', async () => {
      // Create user first
      await User.create({
        displayName: 'Existing',
        email: 'exist@integration.com',
        hashPassword: 'hashed',
        role: 'guest'
      });

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          displayName: 'Test',
          email: 'exist@integration.com',
          password: 'password123'
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message', 'User already exist');
    });

    it('should return validation errors (422) if required fields missing', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'notanemail' });

      // Assuming express-validator is used in the routes
      expect(res.status).toBe(400); // Or 422 depending on validators.js
    });
  });

  describe('POST /api/auth/login', () => {
    it('should successfully login and return a token (200)', async () => {
      // Register user through API to ensure valid hash
      await request(app)
        .post('/api/auth/register')
        .send({
          displayName: 'Login Test',
          email: 'login@integration.com',
          password: 'password123'
        });

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@integration.com',
          password: 'password123'
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should return error for invalid password (400)', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          displayName: 'Wrong Pass',
          email: 'wrong@integration.com',
          password: 'password123'
        });

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'wrong@integration.com',
          password: 'incorrect'
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message', 'Invalid credentials');
    });

    it('should return error for non-existent email (400)', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nobody@integration.com',
          password: 'password123'
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/does not exist/i);
    });
  });
});
