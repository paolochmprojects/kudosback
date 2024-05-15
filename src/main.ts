import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import config from './config';
import { Logger } from '@nestjs/common';

const { port } = config();
const logger = new Logger('main');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  await app.listen(port);

  logger.log(`Listening on port ${port}`);
}
bootstrap();
