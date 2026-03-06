import { describe, it, expect, vi } from 'vitest';
import isAdmin from '../../../src/middlewares/isAdminMiddleware.js';
import { createMockReqRes } from '../../helpers.js';

describe('isAdmin Middleware', () => {
  it('should return 401 if req.user is missing', () => {
    const { req, res, next } = createMockReqRes();
    // req.user is intentionally undefined/empty here

    isAdmin({}, res, next); // simulating missing user by passing empty object

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Authentication required' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 403 if req.user is not admin', () => {
    const { req, res, next } = createMockReqRes({
      user: { role: 'customer' }
    });

    isAdmin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Admin access required' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next if req.user is admin', () => {
    const { req, res, next } = createMockReqRes({
      user: { role: 'admin' }
    });

    isAdmin(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });
});
