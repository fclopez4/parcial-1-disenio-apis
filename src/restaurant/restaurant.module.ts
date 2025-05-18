import { Module } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { RestaurantEntity } from './restaurant.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantController } from './restaurant.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RestaurantEntity])],
  providers: [RestaurantService],
  controllers: [RestaurantController],
})
export class RestaurantModule {}
