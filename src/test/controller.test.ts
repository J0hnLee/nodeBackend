import request from 'supertest';
import express from 'express';
import { register } from '../controllers/authentication';  // Adjust the import path
import { Request, Response } from 'express';
import { getUserByEmail, createUser } from '../db/users';  // Adjust the import path
import { authentication, random } from '../helpers';  // Adjust the import path

jest.mock('../db/users', () => ({
  getUserByEmail: jest.fn(),
  createUser: jest.fn()
}));

jest.mock('../helpers', () => ({
  authentication: jest.fn(),
  random: jest.fn()
}));

describe('Controller Tests', () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    req = {
      body: {
        username: 'test_user',
        email: 'test@example.com',
        password: 'testpassword'
      }
    } as unknown as Request;

    res = {
      sendStatus: jest.fn(),
      json: jest.fn(),
      end: jest.fn()
    } as unknown as Response;

    jest.resetAllMocks();
  });

  it('should register a new user', async () => {
    // Mock getUserByEmail to return null (indicating no existing user)
    (getUserByEmail as jest.Mock).mockResolvedValue(null);

    // Mock random and authentication functions
    (random as jest.Mock).mockReturnValue('mockedsalt');
    (authentication as jest.Mock).mockReturnValue('hashedpassword');

    await register(req, res);

    expect(getUserByEmail).toHaveBeenCalledWith('test@example.com');
    expect(random).toHaveBeenCalled();
    expect(authentication).toHaveBeenCalledWith('mockedsalt', 'testpassword');
    expect(createUser).toHaveBeenCalledWith({
      username: 'test_useeer',
      email: 'test@example.com',
      authentication: {
        salt: 'mockedsalt',
        password: 'hashedpassword'
      }
    });
    expect(res.sendStatus).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      username: 'test_useeer',
      email: 'test@example.com',
      authentication: {
        salt: 'mockedsalt',
        password: 'hashedpassword'
      }
    });
  });

  // it('should handle missing inputs', async () => {
  //   req.body = {};  // Missing required fields

  //   await register(req, res);

  //   expect(res.sendStatus).toHaveBeenCalledWith(400);
  //   expect(createUser).not.toHaveBeenCalled();
  // });

  // it('should handle existing user', async () => {
  //   // Mock getUserByEmail to return an existing user
  //   (getUserByEmail as jest.Mock).mockResolvedValue({});

  //   await register(req, res);

  //   expect(res.sendStatus).toHaveBeenCalledWith(400);
  //   expect(createUser).not.toHaveBeenCalled();
  // });

  // it('should handle error', async () => {
  //   // Mock getUserByEmail to throw an error
  //   (getUserByEmail as jest.Mock).mockRejectedValue(new Error('Database error'));

  //   await register(req, res);

  //   expect(console.log).toHaveBeenCalledWith(new Error('Database error'));
  //   expect(res.sendStatus).toHaveBeenCalledWith(400);
  //   expect(createUser).not.toHaveBeenCalled();
  // });
});
