import { describe, it, expect, vi, beforeEach } from 'vitest';
import Cart from '../../../src/models/cart.js';
import { 
  getCartByUser, 
  createCart, 
  addProductToCart 
} from '../../../src/controllers/cartController.js';
import { createMockReqRes } from '../../helpers.js';

vi.mock('../../../src/models/cart.js');

describe('Cart Controller', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getCartByUser', () => {
    it('should return 404 if no cart found for user', async () => {
      const { req, res, next } = createMockReqRes({ params: { id: 'u1' } });
      
      const mockQuery = {
        populate: vi.fn().mockReturnThis(),
      };
      
      Cart.findOne.mockReturnValue(mockQuery);
      mockQuery.populate
        .mockReturnValueOnce(mockQuery)
        .mockResolvedValueOnce(null);

      await getCartByUser(req, res, next);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'No cart found for this user' });
    });

    it('should return the cart if found', async () => {
      const { req, res, next } = createMockReqRes({ params: { id: 'u1' } });
      const mockCart = { _id: 'c1', user: 'u1', products: [] };
      
      const mockQuery = {
        populate: vi.fn().mockReturnThis()
      };
      
      Cart.findOne.mockReturnValue(mockQuery);
      mockQuery.populate
        .mockReturnValueOnce(mockQuery)
        .mockResolvedValueOnce(mockCart);

      await getCartByUser(req, res, next);
      expect(res.json).toHaveBeenCalledWith(mockCart);
    });
  });

  describe('createCart', () => {
    it('should create a cart successfully', async () => {
      const { req, res, next } = createMockReqRes({
        body: {
          user: 'u1',
          products: [{ product: 'p1', quantity: 1 }]
        }
      });

      const mockCart = {
        populate: vi.fn().mockReturnThis()
      };
      Cart.create.mockResolvedValue(mockCart);

      await createCart(req, res, next);
      expect(Cart.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe('addProductToCart', () => {
    it('should add a new product to an existing cart', async () => {
      const { req, res, next } = createMockReqRes({
        body: { userId: 'u1', productId: 'p2', quantity: 1 }
      });

      const mockCart = {
        user: 'u1',
        products: [{ product: 'p1', quantity: 1 }],
        save: vi.fn().mockResolvedValue(true),
        populate: vi.fn().mockReturnThis()
      };
      // Mock findOne to return existing cart
      Cart.findOne.mockResolvedValue(mockCart);

      await addProductToCart(req, res, next);
      
      expect(mockCart.products).toHaveLength(2);
      expect(mockCart.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should update quantity if product already in cart', async () => {
      const { req, res, next } = createMockReqRes({
        body: { userId: 'u1', productId: 'p1', quantity: 2 }
      });

      const mockCart = {
        user: 'u1',
        products: [{ product: { toString: () => 'p1' }, quantity: 1 }],
        save: vi.fn().mockResolvedValue(true),
        populate: vi.fn().mockReturnThis()
      };
      Cart.findOne.mockResolvedValue(mockCart);

      await addProductToCart(req, res, next);
      
      expect(mockCart.products[0].quantity).toBe(3);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});
