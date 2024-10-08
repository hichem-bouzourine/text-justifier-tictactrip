import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('api')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('token')
    async getToken(@Body() body: { email: string }): Promise<{ token: string }> {
        // Vérifiez si l'email est valide (vous pouvez ajouter une logique de validation ici)
        if (!body.email) {
            throw new UnauthorizedException('Email is required');
        }

        const token = await this.authService.generateToken(body.email);
        return { token };
    }
}
