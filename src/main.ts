import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // parser for text/plain
  app.use((req, res, next) => {
    if (req.headers['content-type'] === 'text/plain') {
      let data = '';

      req.on('data', chunk => {
        data += chunk;
      });

      req.on('end', () => {
        req.body = data;
        next();
      });
    } else {
      next();
    }
  });

  await app.listen(3000);
}
bootstrap();
