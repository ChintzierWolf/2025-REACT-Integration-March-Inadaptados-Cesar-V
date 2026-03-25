import request from 'supertest';
import app from '../../app.js';
import User from '../../src/models/user.js';
import ShippingAddress from '../../src/models/shippingAddress.js';
import { UserBuilder, generateCustomerToken } from '../helpers.js';

describe('Shipping Address Integration Tests', () => {
  let user, token;

  beforeEach(async () => {
    user = await User.create(UserBuilder({ email: `shipping-${Date.now()}@test.com` }));
    token = generateCustomerToken({ _id: user._id });
  });

  describe('POST /api/shipping', () => {
    it('should create a shipping address (201)', async () => {
      const res = await request(app)
        .post('/api/shipping')
        .set('Authorization', `Bearer ${token}`)
        .send({
          address: '123 Test St',
          city: 'Testville',
          state: 'TS',
          zipCode: '12345',
          country: 'Testland'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.address).toBe('123 Test St');
      
      const inDb = await ShippingAddress.findOne({ user: user._id });
      expect(inDb).toBeTruthy();
    });
  });

  describe('GET /api/shipping', () => {
    it('should list user addresses (200)', async () => {
      await ShippingAddress.create({
        user: user._id,
        address: 'Saved Ave',
        city: 'Old Town',
        state: 'OT',
        zipCode: '00000',
        country: 'History'
      });

      const res = await request(app)
        .get('/api/shipping')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].address).toBe('Saved Ave');
    });
  });

  describe('DELETE /api/shipping/:id', () => {
    it('should delete own address (200)', async () => {
      const addr = await ShippingAddress.create({
        user: user._id,
        address: 'To Delete',
        city: 'Ghost',
        state: 'GH',
        zipCode: '666',
        country: 'Void'
      });

      const res = await request(app)
        .delete(`/api/shipping/${addr._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      const inDb = await ShippingAddress.findById(addr._id);
      expect(inDb).toBeNull();
    });

    it('should return 404 if address belongs to another user', async () => {
      const otherUser = await User.create(UserBuilder({ email: 'other@shipping.com' }));
      const addr = await ShippingAddress.create({
        user: otherUser._id,
        address: 'Not Yours',
        city: 'Private',
        state: 'PR',
        zipCode: '999',
        country: 'KeepOut'
      });

      const res = await request(app)
        .delete(`/api/shipping/${addr._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404);
    });
  });
});
