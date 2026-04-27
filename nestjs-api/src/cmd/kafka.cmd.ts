import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppModule } from '../app.module';
import { KafkaServer } from '../kafka/kafka-server';

async function bootstrap() {
  // 1. Cria um contexto temporário para extrair as configurações de ambiente
  const appConfigContext =
    await NestFactory.createApplicationContext(ConfigModule);
  const configService = appConfigContext.get(ConfigService);

  // 2. Define as opções do transporte (Kafka) de forma isolada
  const kafkaOptions: MicroserviceOptions = {
    strategy: new KafkaServer({
      server: {
        'bootstrap.servers': configService.get<string>('KAFKA_BROKER'),
      },
      consumer: {
        'group.id': 'nest-group',
        'client.id': `nest-group-${configService.get<string>('HOSTNAME')}`,
        'max.poll.interval.ms': 10000,
        'session.timeout.ms': 10000,
      },
    }),
  };

  // 3. Instancia o microsserviço com o AppModule e as opções do Kafka
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    kafkaOptions,
  );

  // 4. Inicia a escuta de eventos
  await app.listen();

  console.log(`🚀 Kafka Microservice is running on group: nest-group`);
}

bootstrap().catch((err) => {
  console.error('💥 Error starting microservice', err);
  process.exit(1);
});
