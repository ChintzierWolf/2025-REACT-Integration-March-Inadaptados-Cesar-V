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
 * Generates a valid JWT token for integration testing
 * @param {Object} payload User payload (userId, role)
 * @returns {String} Signed JWT token
 */
export const generateTestToken = (payload = { userId: "mock123", role: "customer" }) => {
  // Use a default secret if process.env.JWT_SECRET is not set during tests
  const secret = process.env.JWT_SECRET || "test-secret";
  return jwt.sign(payload, secret, { expiresIn: "1h" });
};
