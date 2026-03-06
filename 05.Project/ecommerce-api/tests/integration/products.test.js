import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../app.js';
import Product from '../../src/models/product.js';
import { generateTestToken } from '../helpers.js';

describe('Products Integration Tests', () => {
  
  let p1, p2;

  beforeEach(async () => {
    // Seed db with 2 valid products
    p1 = await Product.create({
      title: 'Zelda BOTW',
      sku: 'NIN-ZELDA',
      price: 60,
      description: 'Game',
      genre: ['Adventure'],
      platform: ['Switch'],
      stock: 5,
      brand: 'Nintendo',
      condition: 'new'
    });

    p2 = await Product.create({
      title: 'God of War',
      sku: 'SON-GOW',
      price: 50,
      description: 'Game',
      genre: ['Action'],
      platform: ['PS4'],
      stock: 10,
      brand: 'Sony',
      condition: 'used'
    });
  });

  describe('GET /api/products', () => {
    it('should return paginated products list (200)', async () => {
      const res = await request(app).get('/api/products?page=1&limit=5');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.products)).toBeTruthy();
      expect(res.body.products.length).toBe(2);
      expect(res.body).toHaveProperty('totalPages');
      expect(res.body).toHaveProperty('currentPage');
    });

    it('should filter products by genre', async () => {
      const res = await request(app).get('/api/products?genre=Adventure');
      expect(res.status).toBe(200);
      expect(res.body.products).toHaveLength(1);
      expect(res.body.products[0].title).toBe('Zelda BOTW');
    });
  });

  describe('GET /api/products/:id', () => {
    it('should return a specific product (200)', async () => {
      const res = await request(app).get(`/api/products/${p1._id}`);
      expect(res.status).toBe(200);
      expect(res.body._id).toBe(p1._id.toString());
    });

    it('should return 400 for invalid mongo ID format', async () => {
      const res = await request(app).get('/api/products/invalid_id_format');
      expect(res.status).toBe(400); // 400 or 404 depending on how the error is handled
    });

    it('should return 404 for non-existent product ID', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const res = await request(app).get(`/api/products/${fakeId}`);
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('message', 'Product not found');
    });
  });

  describe('DELETE /api/products/:id', () => {
    it('should delete a product with Admin token (200)', async () => {
      const adminToken = generateTestToken({ userId: 'admin1', role: 'admin' });
      
      const res = await request(app)
        .delete(`/api/products/${p2._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      
      const checkDb = await Product.findById(p2._id);
      expect(checkDb).toBeNull();
    });

    it('should deny delete with customer token (403)', async () => {
      const customerToken = generateTestToken({ userId: 'cust1', role: 'customer' });
      
      const res = await request(app)
        .delete(`/api/products/${p2._id}`)
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(403);
    });
  });
});
