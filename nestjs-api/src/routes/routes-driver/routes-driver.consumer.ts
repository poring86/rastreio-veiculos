import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { KafkaContext } from '../../kafka/kafka-context';
import { RoutesDriverService } from './routes-driver.service';

@Controller()
export class RoutesDriverConsumer {
  private logger = new Logger(RoutesDriverConsumer.name);

  constructor(private routesDriverService: RoutesDriverService) {}
  
  @MessagePattern('simulation')
  async driverMoved(payload: KafkaContext) {
    this.logger.log(
      `Receiving message from topic 'simulation': ${JSON.stringify(payload.messageValue)}`,
    );
    const { route_id, lat, lng } = payload.messageValue;
    await this.routesDriverService.processRoute({
      route_id,
      lat,
      lng,
    });
    //muitas chamadas http
    //http
    //pub/sub - redis
    //grpc
    //route_id, lat, lng
  }
}
