import { Module } from '@nestjs/common';
import { RestaurantDishService } from './restaurant-dish.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantEntity } from '../restaurant/restaurant.entity';
import { DishEntity } from '../dish/dish.entity';
import { RestaurantDishController } from './restaurant-dish.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RestaurantEntity, DishEntity])],
  providers: [RestaurantDishService],
  controllers: [RestaurantDishController],
})
export class RestaurantDishModule {}
