import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger.config';
import { ConsoleLogger } from '@nestjs/common';

class CustomLogger extends ConsoleLogger {
  log(message: any): void {
    super.log(message);
  }
  error(message: any): void {
    super.error(message);
    // aqui poderia implementar um sistema para salvar logs de erros em arquivos
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new CustomLogger(),
  });

  setupSwagger(app);

  await app.listen(3000);
}
bootstrap().catch((error) => {
  console.error(`Ocorreu um erro ao iniciar a API.\n${error}`);
});
