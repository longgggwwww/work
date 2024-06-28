import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as admin from 'firebase-admin';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';
import { AppModule } from './app.module';
import { TrimPipe } from './pipes/trim.pipe';
import * as serviceAccount from './service-account.json';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });

  const configService = app.get(ConfigService);

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
    new TrimPipe(),
  );

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  const config = new DocumentBuilder()
    .setTitle('IIT HUMAN RESOURCE MANAGEMENT')
    .setVersion('1.0')
    .setDescription(
      `
      IIT Human Resource Management API description
      `,
    )
    .setContact('IIT JSC', 'https://iit.vn', 'info@iit.vn')
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .setExternalDoc(
      'OpenAPI Specification',
      'https://swagger.io/specification/',
    )
    .addServer('http://localhost:3000', 'Internal')
    .addServer('https://dlhdpqtc-3000.asse.devtunnels.ms/', 'Development')
    .addServer('https://api-quan-tri-doanh-nghiep.iit.vn', 'Production')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);
}
bootstrap();
