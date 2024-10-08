import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              upsert: jest.fn(),
              create: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should generate a token and save it in the database', async () => {
    const email = 'test@example.com';
    jest.spyOn(prisma.user, 'upsert').mockResolvedValueOnce(undefined);

    const token = await service.generateToken(email);

    expect(token).toBeDefined();
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: { email, token },
    });
  });

  it('should validate a token', async () => {
    const token = 'valid_token';
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce({
      id: 1,
      email: 'test@example.com',
      token,
      wordCount: 1000,
      lastReset: new Date(),
      updatedAt: new Date(),
      createdAt: new Date(),
    });

    const result = await service.validateToken(token);

    expect(result).toBe(true);
    expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { token } });
  });

  it('should return false if the token is invalid', async () => {
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce(null);

    const result = await service.validateToken('invalid_token');

    expect(result).toBe(false);
  });
});
