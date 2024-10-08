import { Controller, Post, Body, Headers, HttpException, HttpStatus, Get } from '@nestjs/common';
import { JustifyService } from './justify.service';
import { AuthService } from '../auth/auth.service';

@Controller('api')
export class JustifyController {
    constructor(
        private readonly justifyService: JustifyService,
        private readonly authService: AuthService,
    ) { }

    @Post('justify')
    async justifyText(@Body() text: string, @Headers('Authorization') token: string) {
        if (!await this.authService.validateToken(token)) {
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }

        const wordCount = text.split(/\s+/).length;

        const userWordCount = await this.authService.userLimit(token);
        if (userWordCount + wordCount > 80000) {
            throw new HttpException('Payment Required: Rate limit exceeded', HttpStatus.PAYMENT_REQUIRED);
        }

        await this.authService.incrementWordCount(token, wordCount);

        return this.justifyService.justifyText(text);
    }
}
