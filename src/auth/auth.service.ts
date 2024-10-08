import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) { }

    async generateToken(email: string): Promise<string> {
        const token = crypto.randomBytes(20).toString('hex');

        // Créer ou mettre à jour l'utilisateur
        await this.prisma.user.upsert({
            where: { email },
            update: { token },
            create: { email, token },
        });

        return token;
    }

    async validateToken(token: string): Promise<boolean> {
        const user = await this.prisma.user.findUnique({ where: { token } });
        return !!user;
    }

    async incrementWordCount(token: string, wordCount: number): Promise<void> {
        const user = await this.prisma.user.findUnique({ where: { token } });

        if (!user) throw new Error('Invalid token');

        const today = new Date();
        // Calculer le nombre de jours depuis la dernière réinitialisation
        const diffDays = Math.floor((today.getTime() - user.lastReset.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays >= 1) {
            // Réinitialiser le compteur de mots après un jour
            await this.prisma.user.update({
                where: { token },
                data: { wordCount: 0, lastReset: today },
            });
        }

        await this.prisma.user.update({
            where: { token },
            data: { wordCount: user.wordCount + wordCount },
        });
    }

    async userLimit(token: string): Promise<number> {
        const user = await this.prisma.user.findUnique({ where: { token } });
        return user.wordCount;
    }
}
