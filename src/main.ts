import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import config from './config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const { port, cors } = config();
const logger = new Logger('main');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: cors.origin.split(','),
  });

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Kudos API')
    .setDescription('API for Kudos')
    .setVersion('0.0.1')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);

  logger.log(`Listening on port ${port}`);
}
bootstrap();
