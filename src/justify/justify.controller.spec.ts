import { Test, TestingModule } from '@nestjs/testing';
import { JustifyController } from './justify.controller';
import { JustifyService } from './justify.service';
import { AuthService } from '../auth/auth.service';
import { UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';

describe('JustifyController', () => {
  let controller: JustifyController;
  let authService: AuthService;
  let justifyService: JustifyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JustifyController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            validateToken: jest.fn(),
            userLimit: jest.fn(),
            incrementWordCount: jest.fn(),
          },
        },
        {
          provide: JustifyService,
          useValue: {
            justifyText: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<JustifyController>(JustifyController);
    authService = module.get<AuthService>(AuthService);
    justifyService = module.get<JustifyService>(JustifyService);
  });

  it('should throw an UnauthorizedException if the token is invalid', async () => {
    jest.spyOn(authService, 'validateToken').mockResolvedValueOnce(false);

    const req = { headers: { authorization: 'invalid_token' } };
    const text = 'some text';

    await expect(controller.justifyText(req, text, {})).rejects.toThrow(UnauthorizedException);
  });

  it('should throw a Payment Required error if the word limit is exceeded', async () => {
    jest.spyOn(authService, 'validateToken').mockResolvedValueOnce(true);
    jest.spyOn(authService, 'userLimit').mockResolvedValueOnce(80000); // Simulate max limit

    const req = { headers: { authorization: 'valid_token' } };
    const text = 'some text';

    await expect(controller.justifyText(req, text, {})).rejects.toThrow(
      new HttpException('Payment Required: Rate limit exceeded', HttpStatus.PAYMENT_REQUIRED),
    );
  });

  it('should justify text and return it', async () => {
    jest.spyOn(authService, 'validateToken').mockResolvedValueOnce(true);
    jest.spyOn(authService, 'userLimit').mockResolvedValueOnce(1000); // Simulate below limit
    jest.spyOn(authService, 'incrementWordCount').mockResolvedValueOnce(undefined);
    jest.spyOn(justifyService, 'justifyText').mockReturnValue('justified text');

    const req = { headers: { authorization: 'valid_token' } };
    const text = 'some text';

    const res = { setHeader: jest.fn().mockReturnThis(), send: jest.fn() }; // Mock setHeader and send

    await controller.justifyText(req, text, res);

    expect(justifyService.justifyText).toHaveBeenCalledWith(text);
    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'text/plain');
    expect(res.send).toHaveBeenCalledWith('justified text');
  });

});
