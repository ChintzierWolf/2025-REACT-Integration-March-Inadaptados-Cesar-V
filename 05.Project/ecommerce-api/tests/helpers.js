import { vi } from 'vitest';
import jwt from "jsonwebtoken";

/**
 * Creates mock req, res, and next objects for Express controller testing.
 * @param {Object} overrides Default overrides for req object
 * @returns {Object} { req, res, next }
 */
export const createMockReqRes = (overrides = {}) => {
  const req = {
    body: {},
    params: {},
    query: {},
    user: {},
    headers: {},
    ...overrides,
  };

  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
    send: vi.fn().mockReturnThis(),
  };

  const next = vi.fn();

  return { req, res, next };
};

/**
 * Data Builders for consistent test data
 */

export const UserBuilder = (overrides = {}) => ({
  displayName: "Test User",
  email: `test-${Date.now()}@example.com`,
  password: "password123",
  role: "customer",
  isActive: true,
  ...overrides
});

export const ProductBuilder = (overrides = {}) => ({
  name: "Test Game",
  description: "A great game",
  price: 59.99,
  stock: 10,
  genre: "Action",
  platform: "PC",
  ...overrides
});

export const OrderBuilder = (userId, products = [], overrides = {}) => ({
  user: userId,
  products: products.map(p => ({
    product: p._id,
    quantity: 1,
    price: p.price
  })),
  totalPrice: products.reduce((sum, p) => sum + p.price, 0),
  status: "pending",
  ...overrides
});

/**
 * Token Helpers
 */

export const generateTestToken = (payload = {}) => {
  const defaultPayload = { userId: "mock123", role: "customer" };
  const secret = process.env.JWT_SECRET || "test-secret";
  return jwt.sign({ ...defaultPayload, ...payload }, secret, { expiresIn: "1h" });
};

export const generateAdminToken = (overrides = {}) => 
  generateTestToken({ role: "admin", ...overrides });

export const generateCustomerToken = (overrides = {}) => 
  generateTestToken({ role: "customer", ...overrides });
