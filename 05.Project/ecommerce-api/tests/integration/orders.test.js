import request from 'supertest';
import app from '../../app.js';
import User from '../../src/models/user.js';
import Product from '../../src/models/product.js';
import Order from '../../src/models/order.js';
import Category from '../../src/models/category.js';
import { generateTestToken } from '../helpers.js';

describe('Orders Integration Tests', () => {
  let custUser, adminUser, product1, product2, cat;
  let custToken, adminToken;

  beforeEach(async () => {
    cat = await Category.create({
      name: 'Videojuegos',
      description: 'Categoría de prueba'
    });

    custUser = await User.create({
      displayName: 'Customer',
      email: 'customer@order.com',
      hashPassword: 'hash',
      role: 'customer'
    });

    adminUser = await User.create({
      displayName: 'Admin',
      email: 'admin@order.com',
      hashPassword: 'hash',
      role: 'admin'
    });

    custToken = generateTestToken({ id: custUser._id, role: custUser.role });
    adminToken = generateTestToken({ id: adminUser._id, role: adminUser.role });

    product1 = await Product.create({
      name: 'P1', sku: 'S1', price: 500, description: 'D', stock: 10, category: cat._id, platform: 'PC', genre: 'Action'
    });
    
    product2 = await Product.create({
      name: 'P2', sku: 'S2', price: 200, description: 'D', stock: 10, category: cat._id, platform: 'PC', genre: 'Action'
    });
  });

  describe('POST /api/orders', () => {
    it('should create an order successfully with correct total calculation (201)', async () => {
      const res = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${custToken}`)
        .send({
          user: custUser._id,
          products: [
            { productId: product1._id, quantity: 2, price: product1.price },
            { productId: product2._id, quantity: 1, price: product2.price }
          ],
          shippingAddress: '123 Fake St',
          paymentMethod: 'CreditCard',
          shippingCost: 50
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('status', 'pending');
      // Total: (2 * 500) + (1 * 200) + 50 = 1250
      expect(res.body.totalPrice).toBe(1250); 
      
      // Verification of Stock Reduction
      const p1After = await Product.findById(product1._id);
      expect(p1After.stock).toBe(8); // 10 - 2
      const p2After = await Product.findById(product2._id);
      expect(p2After.stock).toBe(9); // 10 - 1
    });

    it('should fail if products array is empty (400)', async () => {
      const res = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${custToken}`)
        .send({
          user: custUser._id,
          products: [],
          shippingAddress: '123 Fake St',
          paymentMethod: 'CreditCard'
        });

      expect(res.status).toBe(400); // Or 422
      expect(res.body.error).toContain('products array');
    });
  });

  describe('GET /api/orders/:id', () => {
    let order;

    beforeEach(async () => {
      order = await Order.create({
        user: custUser._id,
        products: [{ productId: product1._id, quantity: 1, price: 500 }],
        shippingAddress: '123 Fake St',
        paymentMethod: 'CC',
        totalPrice: 500,
        status: 'pending',
        paymentStatus: 'pending'
      });
    });

    it('should allow customer to view their own order (200)', async () => {
      const res = await request(app)
        .get(`/api/orders/${order._id}`)
        .set('Authorization', `Bearer ${custToken}`);

      expect(res.status).toBe(200);
      expect(res.body._id).toBe(order._id.toString());
      expect(res.body.user._id).toBe(custUser._id.toString());
    });

    it('should forbid customer from viewing another users order (403)', async () => {
      const otherUser = await User.create({
        displayName: 'Hacker',
        email: 'hacker@test.com',
        hashPassword: 'hash',
        role: 'customer'
      });
      const hackerToken = generateTestToken({ id: otherUser._id, role: otherUser.role });
      
      const res = await request(app)
        .get(`/api/orders/${order._id}`)
        .set('Authorization', `Bearer ${hackerToken}`);

      expect(res.status).toBe(403);
    });
  });

  describe('PATCH /api/orders/:id/cancel', () => {
    let pendingOrder, shippedOrder;

    beforeEach(async () => {
      pendingOrder = await Order.create({
        user: custUser._id,
        products: [{ productId: product1._id, quantity: 1, price: 500 }],
        shippingAddress: 'Address', paymentMethod: 'CC',
        totalPrice: 500, status: 'pending', paymentStatus: 'paid'
      });

      shippedOrder = await Order.create({
        user: custUser._id,
        products: [{ productId: product1._id, quantity: 1, price: 500 }],
        shippingAddress: 'Address', paymentMethod: 'CC',
        totalPrice: 500, status: 'shipped', paymentStatus: 'paid'
      });
    });

    it('should successfully cancel a pending order (200)', async () => {
      const res = await request(app)
        .patch(`/api/orders/${pendingOrder._id}/cancel`)
        .set('Authorization', `Bearer ${custToken}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('cancelled');
      expect(res.body.paymentStatus).toBe('refunded'); // Reverting paid to refunded
    });

    it('should reject cancelling a shipped order (400)', async () => {
      const res = await request(app)
        .patch(`/api/orders/${shippedOrder._id}/cancel`)
        .set('Authorization', `Bearer ${custToken}`);

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('Cannot cancel order');
    });
  });
});
