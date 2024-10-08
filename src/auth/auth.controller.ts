import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('api')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('token')
    async getToken(@Body() body: { email: string }) {
        const token = await this.authService.generateToken(body.email);
        return { token };
    }
}
