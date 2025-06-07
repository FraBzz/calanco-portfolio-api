import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  console.log('WEATHER_API_KEY:', configService.get('WEATHER_API_KEY'));

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Calanco Portfolio API')
    .setDescription('A comprehensive API showcasing various technologies including Product Management, Weather Forecasting, and E-commerce functionality')
    .setVersion('1.0')
    .addTag('Products', 'Product management operations')
    .addTag('Weather', 'Weather forecast and current conditions')
    .addTag('Cart', 'Shopping cart management')
    .addTag('orders', 'Order processing and retrieval')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
