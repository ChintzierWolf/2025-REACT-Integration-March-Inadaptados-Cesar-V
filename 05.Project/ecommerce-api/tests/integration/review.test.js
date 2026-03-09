import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../app.js';
import User from '../../src/models/user.js';
import Product from '../../src/models/product.js';
import Review from '../../src/models/review.js';
import { UserBuilder, ProductBuilder, generateCustomerToken, generateAdminToken } from '../helpers.js';

describe('Review Integration Tests', () => {
  let customerUser, adminUser, testProduct, customerToken, adminToken;

  beforeEach(async () => {
    // Setup users and products using Builders
    customerUser = await User.create(UserBuilder({ email: `customer-${Date.now()}@test.com` }));
    adminUser = await User.create(UserBuilder({ email: `admin-${Date.now()}@test.com`, role: 'admin' }));
    testProduct = await Product.create(ProductBuilder());

    customerToken = generateCustomerToken({ _id: customerUser._id });
    adminToken = generateAdminToken({ _id: adminUser._id });
  });

  describe('POST /api/reviews', () => {
    it('should create a review successfully (201)', async () => {
      const res = await request(app)
        .post('/api/reviews')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          productId: testProduct._id,
          rating: 5,
          comment: 'Perfect game!'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.comment).toBe('Perfect game!');
      
      const reviewInDb = await Review.findOne({ product: testProduct._id, user: customerUser._id });
      expect(reviewInDb).toBeTruthy();
    });

    it('should return 400 if user tries to review same product twice', async () => {
      // First review
      await Review.create({
        user: customerUser._id,
        product: testProduct._id,
        rating: 4,
        comment: 'First try'
      });

      const res = await request(app)
        .post('/api/reviews')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          productId: testProduct._id,
          rating: 1,
          comment: 'Double review'
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/Ya enviaste una reseña/i);
    });
  });

  describe('GET /api/reviews/product/:productId', () => {
    it('should list all reviews for a product (200)', async () => {
      await Review.create({
        user: customerUser._id,
        product: testProduct._id,
        rating: 3,
        comment: 'Generic review'
      });

      const res = await request(app).get(`/api/reviews/product/${testProduct._id}`);

      expect(res.status).toBe(200);
      expect(res.body.count).toBe(1);
      expect(res.body.data[0].comment).toBe('Generic review');
      expect(res.body.data[0].user.displayName).toBe(customerUser.displayName);
    });
  });

  describe('DELETE /api/reviews/:id', () => {
    it('should allow user to delete their own review (200)', async () => {
      const review = await Review.create({
        user: customerUser._id,
        product: testProduct._id,
        rating: 5,
        comment: 'Temporary'
      });

      const res = await request(app)
        .delete(`/api/reviews/${review._id}`)
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(200);
      const reviewInDb = await Review.findById(review._id);
      expect(reviewInDb).toBeNull();
    });

    it('should allow admin to delete any review (200)', async () => {
        const review = await Review.create({
          user: customerUser._id,
          product: testProduct._id,
          rating: 5,
          comment: 'User review'
        });
  
        const res = await request(app)
          .delete(`/api/reviews/${review._id}`)
          .set('Authorization', `Bearer ${adminToken}`);
  
        expect(res.status).toBe(200);
      });

    it('should return 403 if user tries to delete someone else\'s review', async () => {
      const otherUser = await User.create(UserBuilder({ email: 'other@test.com' }));
      const review = await Review.create({
        user: otherUser._id,
        product: testProduct._id,
        rating: 2,
        comment: 'Not mine'
      });

      const res = await request(app)
        .delete(`/api/reviews/${review._id}`)
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(403);
      expect(res.body.message).toMatch(/No tienes permiso/i);
    });
  });
});
