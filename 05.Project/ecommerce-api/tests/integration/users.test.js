import request from 'supertest';
import app from '../../app.js';
import User from '../../src/models/user.js';
import { generateTestToken } from '../helpers.js';
import bcrypt from 'bcrypt';

describe('Users Integration Tests', () => {
  let u1, admin;
  let u1Token, adminToken;

  beforeEach(async () => {
    const hash = await bcrypt.hash('password123', 10);
    
    u1 = await User.create({
      displayName: 'Customer User',
      email: 'customer@test.com',
      hashPassword: hash,
      role: 'customer',
      isActive: true
    });

    admin = await User.create({
      displayName: 'Admin User',
      email: 'admin@test.com',
      hashPassword: hash,
      role: 'admin',
      isActive: true
    });

    u1Token = generateTestToken({ id: u1._id, role: u1.role });
    adminToken = generateTestToken({ id: admin._id, role: admin.role });
  });

  describe('GET /api/users/profile', () => {
    it('should get own profile with valid token (200)', async () => {
      const res = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${u1Token}`);

      expect(res.status).toBe(200);
      expect(res.body.email).toBe('customer@test.com');
      expect(res.body).not.toHaveProperty('hashPassword');
    });

    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/users/profile');
      expect(res.status).toBe(401);
    });
  });

  describe('PUT /api/users/profile', () => {
    it('should update own profile (200)', async () => {
      const res = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${u1Token}`)
        .send({ displayName: 'Updated Name', phone: '987654321' });

      expect(res.status).toBe(200);
      expect(res.body.displayName).toBe('Updated Name');

      const checkDb = await User.findById(u1._id);
      expect(checkDb.displayName).toBe('Updated Name');
      expect(checkDb.phone).toBe('987654321');
    });
  });

  describe('PUT /api/users/change-pass', () => {
    it('should successfully change password (200)', async () => {
      const res = await request(app)
        .put('/api/users/change-pass')
        .set('Authorization', `Bearer ${u1Token}`)
        .send({
          currentPassword: 'password123',
          newPassword: 'newpassword456'
        });

      expect(res.status).toBe(200);

      // Verify DB Hash changed
      const checkDb = await User.findById(u1._id);
      const isMatch = await bcrypt.compare('newpassword456', checkDb.hashPassword);
      expect(isMatch).toBeTruthy();
    });

    it('should fail if current password is wrong (400)', async () => {
      const res = await request(app)
        .put('/api/users/change-pass')
        .set('Authorization', `Bearer ${u1Token}`)
        .send({
          currentPassword: 'wrongpassword',
          newPassword: 'newpassword456'
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message', 'Current password is incorrect');
    });
  });

  describe('GET /api/users', () => {
    it('should allow admin to list all users (200)', async () => {
      const res = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBeGreaterThanOrEqual(2);
    });

    it('should deny customer to list users (403)', async () => {
      const res = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${u1Token}`);

      expect(res.status).toBe(403);
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should soft delete user when requested by admin (200)', async () => {
      const res = await request(app)
        .delete(`/api/users/${u1._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);

      const checkDb = await User.findById(u1._id);
      expect(checkDb.isActive).toBe(false); // soft deletion logic assumed
    });
  });
});
