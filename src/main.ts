import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import corsOptions from './config/corsOptions';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors(corsOptions);
  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT ?? 3000);

  // const app = await NestFactory.create(AppModule, {
  //   bufferLogs: true,
  // });
  // app.useLogger(app.get(MyLoggerService));
  // app.enableCors();
  // app.setGlobalPrefix('api');
  // await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
