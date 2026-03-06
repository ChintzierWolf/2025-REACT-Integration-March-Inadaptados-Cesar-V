import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../app.js';
import User from '../../src/models/user.js';
import Product from '../../src/models/product.js';
import Order from '../../src/models/order.js';
import { generateTestToken } from '../helpers.js';

describe('Orders Integration Tests', () => {
  let custUser, adminUser, product1, product2;
  let custToken, adminToken;

  beforeEach(async () => {
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
      title: 'P1', sku: 'S1', price: 500, description: 'D', stock: 10
    });
    
    product2 = await Product.create({
      title: 'P2', sku: 'S2', price: 200, description: 'D', stock: 10
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
