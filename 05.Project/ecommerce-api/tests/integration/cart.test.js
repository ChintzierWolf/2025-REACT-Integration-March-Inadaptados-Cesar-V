import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../app.js';
import User from '../../src/models/user.js';
import Product from '../../src/models/product.js';
import Cart from '../../src/models/cart.js';
import { UserBuilder, ProductBuilder, generateCustomerToken } from '../helpers.js';

describe('Cart Integration Tests', () => {
  let user, product, token;

  beforeEach(async () => {
    user = await User.create(UserBuilder({ email: `cart-${Date.now()}@test.com` }));
    product = await Product.create(ProductBuilder());
    token = generateCustomerToken({ _id: user._id });
  });

  describe('POST /api/cart/cart/add-product', () => {
    it('should add a product and create a cart if it doesnt exist (200)', async () => {
      const res = await request(app)
        .post('/api/cart/cart/add-product')
        .send({
          userId: user._id,
          productId: product._id,
          quantity: 2
        });

      expect(res.status).toBe(200);
      expect(res.body.products).toHaveLength(1);
      expect(res.body.products[0].quantity).toBe(2);
      
      const cartInDb = await Cart.findOne({ user: user._id });
      expect(cartInDb).toBeTruthy();
    });

    it('should increment quantity if product is already in cart (200)', async () => {
      // Setup: existing cart with product
      await Cart.create({
        user: user._id,
        products: [{ product: product._id, quantity: 1 }]
      });

      const res = await request(app)
        .post('/api/cart/cart/add-product')
        .send({
          userId: user._id,
          productId: product._id,
          quantity: 3
        });

      expect(res.status).toBe(200);
      expect(res.body.products[0].quantity).toBe(4);
    });
  });

  describe('GET /api/cart/cart/user/:id', () => {
    it('should return the user cart with details (200)', async () => {
      await Cart.create({
        user: user._id,
        products: [{ product: product._id, quantity: 5 }]
      });

      const res = await request(app).get(`/api/cart/cart/user/${user._id}`);

      expect(res.status).toBe(200);
      expect(res.body.products[0].product.name).toBe(product.name);
      expect(res.body.products[0].quantity).toBe(5);
    });

    it('should return 404 if no cart exists for the user', async () => {
      const res = await request(app).get(`/api/cart/cart/user/${user._id}`);
      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /api/cart/cart/:id', () => {
    it('should delete a cart (204)', async () => {
      const cart = await Cart.create({
        user: user._id,
        products: [{ product: product._id, quantity: 1 }]
      });

      const res = await request(app).delete(`/api/cart/cart/${cart._id}`);
      expect(res.status).toBe(204);
      
      const inDb = await Cart.findById(cart._id);
      expect(inDb).toBeNull();
    });
  });
});
