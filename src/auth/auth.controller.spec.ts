import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            generateToken: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should throw an UnauthorizedException if no email is provided', async () => {
    await expect(controller.getToken({ email: '' })).rejects.toThrow(UnauthorizedException);
  });

  it('should return a token when a valid email is provided', async () => {
    const email = 'test@example.com';
    const token = 'test_token';
    jest.spyOn(authService, 'generateToken').mockResolvedValueOnce(token);

    const result = await controller.getToken({ email });

    expect(result).toEqual({ token });
    expect(authService.generateToken).toHaveBeenCalledWith(email);
  });
});
