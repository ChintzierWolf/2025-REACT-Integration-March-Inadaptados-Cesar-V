import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../app.js';
import User from '../../src/models/user.js';
import Product from '../../src/models/product.js';
import WishList from '../../src/models/wishList.js';
import { UserBuilder, ProductBuilder, generateCustomerToken } from '../helpers.js';

describe('Wishlist Integration Tests', () => {
  let user, product, token;

  beforeEach(async () => {
    user = await User.create(UserBuilder({ email: `wishlist-${Date.now()}@test.com` }));
    product = await Product.create(ProductBuilder());
    token = generateCustomerToken({ _id: user._id });
  });

  describe('POST /api/wishlist/toggle', () => {
    it('should create a wishlist and add a product if it doesnt exist (201)', async () => {
      const res = await request(app)
        .post('/api/wishlist/toggle')
        .set('Authorization', `Bearer ${token}`)
        .send({ productId: product._id });

      expect(res.status).toBe(201);
      expect(res.body.message).toMatch(/Agregado a WishList/i);
      expect(res.body.data.products).toContain(product._id.toString());
    });

    it('should remove product if it is already in the wishlist (200)', async () => {
      // Setup: add product first
      await WishList.create({ user: user._id, products: [product._id] });

      const res = await request(app)
        .post('/api/wishlist/toggle')
        .set('Authorization', `Bearer ${token}`)
        .send({ productId: product._id });

      expect(res.status).toBe(200);
      expect(res.body.message).toMatch(/WishList actualizada/i);
      expect(res.body.data.products).not.toContain(product._id.toString());
    });

    it('should add another product if wishlist already exists (200)', async () => {
      const otherProduct = await Product.create(ProductBuilder({ name: 'Other Game' }));
      await WishList.create({ user: user._id, products: [product._id] });

      const res = await request(app)
        .post('/api/wishlist/toggle')
        .set('Authorization', `Bearer ${token}`)
        .send({ productId: otherProduct._id });

      expect(res.status).toBe(200);
      expect(res.body.data.products).toHaveLength(2);
    });
  });

  describe('GET /api/wishlist', () => {
    it('should return the user wishlist with products populated (200)', async () => {
      await WishList.create({ user: user._id, products: [product._id] });

      const res = await request(app)
        .get('/api/wishlist')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data.products[0].name).toBe(product.name);
    });

    it('should return an empty list if user has no wishlist (200)', async () => {
      const res = await request(app)
        .get('/api/wishlist')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data.products).toEqual([]);
    });
  });
});
