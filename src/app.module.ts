import { Module } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { JustifyService } from './justify/justify.service';
import { JustifyController } from './justify/justify.controller';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [],
  controllers: [AuthController, JustifyController],
  providers: [AuthService, JustifyService, PrismaService],
})
export class AppModule { }
