import { describe, it, expect, vi, beforeEach } from 'vitest';
import Order from '../../../src/models/order.js';
import { createOrder, cancelOrder } from '../../../src/controllers/orderController.js';
import { createMockReqRes } from '../../helpers.js';

vi.mock('../../../src/models/order.js');

describe('Order Controller', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createOrder', () => {
    it('should create an order with correct total price', async () => {
      const { req, res, next } = createMockReqRes({
        body: {
          user: 'u1',
          products: [{ productId: 'p1', quantity: 2, price: 50 }, { productId: 'p2', quantity: 1, price: 100 }],
          shippingAddress: 'a1',
          paymentMethod: 'pm1',
          shippingCost: 20
        }
      });

      const mockPopulate = vi.fn().mockReturnThis();
      Order.create.mockResolvedValue({ populate: mockPopulate });

      await createOrder(req, res, next);

      expect(Order.create).toHaveBeenCalledWith(expect.objectContaining({
        user: 'u1',
        totalPrice: 220, // (2*50) + (1*100) + 20
        status: 'pending',
        paymentStatus: 'pending'
      }));
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should return 400 if products missing', async () => {
      const { req, res, next } = createMockReqRes({ body: { user: 'u1' } });
      await createOrder(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'User and products array are required' });
    });

    it('should return 400 if product structure invalid', async () => {
      const { req, res, next } = createMockReqRes({
        body: {
          user: 'u1',
          products: [{ productId: 'p1', quantity: 0, price: 50 }], // quantity < 1
          shippingAddress: 'a1',
          paymentMethod: 'pm1'
        }
      });
      await createOrder(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.stringContaining('Each product must have') }));
    });
  });

  describe('cancelOrder', () => {
    it('should cancel a pending order and refund if paid', async () => {
      const { req, res, next } = createMockReqRes({ params: { id: 'o1' } });
      Order.findById.mockResolvedValue({ _id: 'o1', status: 'pending', paymentStatus: 'paid' });
      
      const mockPopulate = vi.fn().mockReturnThis();
      Order.findByIdAndUpdate.mockReturnValue({ populate: mockPopulate });

      await cancelOrder(req, res, next);

      expect(Order.findByIdAndUpdate).toHaveBeenCalledWith(
        'o1',
        { status: 'cancelled', paymentStatus: 'refunded' },
        { new: true }
      );
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should fail to cancel a delivered order', async () => {
      const { req, res, next } = createMockReqRes({ params: { id: 'o1' } });
      Order.findById.mockResolvedValue({ _id: 'o1', status: 'delivered' });

      await cancelOrder(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.stringContaining('Cannot cancel order') }));
    });

    it('should return 404 if order not found', async () => {
      const { req, res, next } = createMockReqRes({ params: { id: 'o1' } });
      Order.findById.mockResolvedValue(null);

      await cancelOrder(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});
