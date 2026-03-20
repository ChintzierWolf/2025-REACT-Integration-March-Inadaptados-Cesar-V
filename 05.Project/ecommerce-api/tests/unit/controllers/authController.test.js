import { describe, it, expect, vi, beforeEach } from 'vitest';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../../../src/models/user.js';
import { register, login } from '../../../src/controllers/authController.js';
import { createMockReqRes } from '../../helpers.js';

vi.mock('../../../src/models/user.js');
vi.mock('bcrypt');
vi.mock('jsonwebtoken');

describe('Auth Controller', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  describe('register', () => {
    it('should successfully register a new user', async () => {
      const { req, res, next } = createMockReqRes({
        body: { displayName: 'John', email: 'test@test.com', password: 'pass', phone: '123456789' }
      });
      User.findOne.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashed');
      
      const mockSave = vi.fn().mockResolvedValue(true);
      User.mockImplementation(function() {
        return { save: mockSave };
      });

      await register(req, res, next);

      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@test.com' });
      expect(bcrypt.hash).toHaveBeenCalled();
      expect(mockSave).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ displayName: 'John', email: 'test@test.com', phone: '123456789' });
    });

    it('should return 400 if user already exists', async () => {
      const { req, res, next } = createMockReqRes({
        body: { email: 'exist@test.com' }
      });
      User.findOne.mockResolvedValue({ email: 'exist@test.com' });

      await register(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'User already exist' });
    });

    it('should call next on error', async () => {
      const { req, res, next } = createMockReqRes();
      User.findOne.mockRejectedValue(new Error('DB Error'));

      await register(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('login', () => {
    it('should successfully login and return token', async () => {
      const { req, res, next } = createMockReqRes({
        body: { email: 'test@test.com', password: 'pass' }
      });
      const mockUser = { _id: '123', email: 'test@test.com', hashPassword: 'hashed', role: 'guest', displayName: 'Test', phone: '123', avatar: 'avatar.png' };
      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('mock_token');

      await login(req, res, next);

      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@test.com' });
      expect(bcrypt.compare).toHaveBeenCalledWith('pass', 'hashed');
      expect(jwt.sign).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        token: 'mock_token',
        user: {
          _id: '123',
          displayName: 'Test',
          email: 'test@test.com',
          role: 'guest',
          phone: '123',
          avatar: 'avatar.png'
        }
      });
    });

    it('should return 400 if user does not exist', async () => {
      const { req, res, next } = createMockReqRes({
        body: { email: 'fake@test.com' }
      });
      User.findOne.mockResolvedValue(null);

      await login(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'User does not exist. You must to sign in' });
    });

    it('should return 400 if password does not match', async () => {
      const { req, res, next } = createMockReqRes({
        body: { email: 'test@test.com', password: 'wrong' }
      });
      User.findOne.mockResolvedValue({ _id: '123', email: 'test@test.com', hashPassword: 'hashed' });
      bcrypt.compare.mockResolvedValue(false);

      await login(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    });

    it('should call next on error', async () => {
      const { req, res, next } = createMockReqRes();
      User.findOne.mockRejectedValue(new Error('DB Error'));

      await login(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
