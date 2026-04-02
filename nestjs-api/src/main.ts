import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { ConfigService } from '@nestjs/config';
import { KafkaServer } from './kafka/kafka-server';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const configService = app.get(ConfigService);
  
  const port = process.env.PORT ?? 3333;

  // Hybrid microservice
  try {
    app.connectMicroservice({
      strategy: new KafkaServer({
        server: {
          'bootstrap.servers': configService.get('KAFKA_BROKER'),
        },
        consumer: {
          'group.id': 'nest-group',
        },
      }),
    });
    // Don't await this, let it run in background
    app.startAllMicroservices().catch(err => console.error('Kafka Startup Error:', err));
  } catch (err) {
    console.error('Kafka Connection Error:', err);
  }

  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();