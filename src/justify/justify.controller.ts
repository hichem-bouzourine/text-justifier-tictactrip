import { Controller, Post, Body, Headers, HttpException, HttpStatus, Request, Response, UnauthorizedException } from '@nestjs/common';
import { JustifyService } from './justify.service';
import { AuthService } from '../auth/auth.service';

@Controller('api')
export class JustifyController {
    constructor(
        private readonly justifyService: JustifyService,
        private readonly authService: AuthService,
    ) { }

    @Post('justify')
    async justifyText(@Request() req, @Body() text: string, @Response() res) {
        const token = req.headers['authorization'];

        if (!token || !await this.authService.validateToken(token)) {
            throw new UnauthorizedException('Invalid token');
        }

        const wordCount = text.split(/\s+/).length;

        // Vérifier si le nombre de mots dépasse la limite de 80 000 mots
        const userWordCount = await this.authService.userLimit(token);
        if (userWordCount + wordCount > 80000) {
            throw new HttpException('Payment Required: Rate limit exceeded', HttpStatus.PAYMENT_REQUIRED);
        }

        // Incrémenter le compteur de mots de l'utilisateur
        await this.authService.incrementWordCount(token, wordCount);

        // traitement de notre texte
        const justifiedText = this.justifyService.justifyText(text);

        // Retourner le texte justifié mais le plus important c'est de retourner avec le bon header Content-Type
        return res.setHeader('Content-Type', 'text/plain').send(justifiedText);

    }
}
