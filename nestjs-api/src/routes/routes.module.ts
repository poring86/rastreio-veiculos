import { Module } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { RoutesController } from './routes.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { MapsModule } from '../maps/maps.module';
import { RoutesDriverService } from './routes-driver.service';
import { RoutesDriverGateway } from './routes-driver/routes-driver.gateway';

@Module({
  imports: [PrismaModule, MapsModule],
  controllers: [RoutesController],
  providers: [RoutesService, RoutesDriverService, RoutesDriverGateway],
})
export class RoutesModule {}
