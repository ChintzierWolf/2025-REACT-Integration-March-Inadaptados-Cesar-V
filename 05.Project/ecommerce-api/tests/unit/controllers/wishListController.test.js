import WishList from '../../../src/models/wishList.js';
import { toggleWishlistItem, getWishList } from '../../../src/controllers/wishListController.js';
import { createMockReqRes } from '../../helpers.js';

vi.mock('../../../src/models/wishList.js');

describe('WishList Controller', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  describe('toggleWishlistItem', () => {
    it('should create a new wishlist if one does not exist', async () => {
      const { req, res, next } = createMockReqRes({
        user: { _id: 'user123' },
        body: { productId: 'prod123' }
      });
      
      WishList.findOne.mockResolvedValue(null);
      WishList.create.mockResolvedValue({ user: 'user123', products: [{ product: 'prod123' }] });

      await toggleWishlistItem(req, res, next);

      expect(WishList.create).toHaveBeenCalledWith({
        user: 'user123',
        products: [{ product: 'prod123' }]
      });
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should add a product if it is not in the wishlist', async () => {
      const { req, res, next } = createMockReqRes({
        user: { _id: 'user123' },
        body: { productId: 'prod123' }
      });
      
      const mockWishList = {
        user: 'user123',
        products: [],
        save: vi.fn().mockResolvedValue(true)
      };
      WishList.findOne.mockResolvedValue(mockWishList);

      await toggleWishlistItem(req, res, next);

      expect(mockWishList.products).toContainEqual({ product: 'prod123' });
      expect(mockWishList.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should remove a product if it is already in the wishlist', async () => {
      const { req, res, next } = createMockReqRes({
        user: { _id: 'user123' },
        body: { productId: 'prod123' }
      });
      
      const mockWishList = {
        user: 'user123',
        products: [{ 
            product: { toString: () => 'prod123' } 
        }],
        save: vi.fn().mockResolvedValue(true)
      };
      WishList.findOne.mockResolvedValue(mockWishList);

      await toggleWishlistItem(req, res, next);

      expect(mockWishList.products.length).toBe(0);
      expect(mockWishList.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('getWishList', () => {
    it('should return populated wishlist', async () => {
      const { req, res, next } = createMockReqRes({
        user: { _id: 'user123' }
      });
      
      const mockWishList = {
        user: 'user123',
        products: [{ product: { name: 'Game' } }]
      };
      WishList.findOne.mockReturnValue({
        populate: vi.fn().mockResolvedValue(mockWishList)
      });

      await getWishList(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true, data: mockWishList });
    });
  });
});
