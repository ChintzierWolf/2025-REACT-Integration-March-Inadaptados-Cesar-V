import { describe, it, expect, vi, beforeEach } from 'vitest';
import jwt from 'jsonwebtoken';
import authMiddleware from '../../../src/middlewares/authMiddleware.js';
import { createMockReqRes } from '../../helpers.js';

vi.mock('jsonwebtoken');

describe('Auth Middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 401 if no authorization header', () => {
    const { req, res, next } = createMockReqRes();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Token no proporcionado o mal formado' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if header does not start with Bearer', () => {
    const { req, res, next } = createMockReqRes({
      headers: { authorization: 'Basic token123' }
    });

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('should populate req.user and call next if token is valid', () => {
    const { req, res, next } = createMockReqRes({
      headers: { authorization: 'Bearer valid_token' }
    });
    // La implementación real del middleware espera 'userId'
    const payload = { userId: '123', role: 'customer' };
    jwt.verify.mockReturnValue(payload);

    authMiddleware(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith('valid_token', process.env.JWT_SECRET);
    // El middleware normaliza los campos id y _id basados en userId
    expect(req.user).toEqual(expect.objectContaining({ 
      userId: '123', 
      role: 'customer',
      id: '123',
      _id: '123'
    }));
    expect(next).toHaveBeenCalled();
  });

  it('should return 403 if token payload is missing userId or role', () => {
    const { req, res, next } = createMockReqRes({
      headers: { authorization: 'Bearer invalid_payload_token' }
    });
    jwt.verify.mockReturnValue({ userId: '123' }); // missing role

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Token inválido: campos faltantes' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 403 if jwt.verify throws an error', () => {
    const { req, res, next } = createMockReqRes({
      headers: { authorization: 'Bearer expired_token' }
    });
    jwt.verify.mockImplementation(() => {
      throw new Error('jwt expired');
    });

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Token inválido o expirado' });
    expect(next).not.toHaveBeenCalled();
  });
});
