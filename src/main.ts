import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger.config';
import { GlobalExceptionFilter } from './common/filters/http-exception-filter';
import { CustomLogger } from './common/logger/custom-logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new CustomLogger(),
  });

  app.enableCors({
    origin: process.env.FRONTEND_URL,
    methods: 'GET, POST',
    credentials: true,
  });
  setupSwagger(app);

  console.log(process.env.FRONTEND_URL);

  app.useGlobalFilters(new GlobalExceptionFilter());

  await app.listen(process.env.PORT || 3000);
}
bootstrap().catch((error) => {
  console.error(`Ocorreu um erro ao iniciar a API.\n${error}`);
});
