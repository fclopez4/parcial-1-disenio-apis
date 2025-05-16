import { Module } from '@nestjs/common';
import { RestaurantDishService } from './restaurant-dish.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantEntity } from 'src/restaurant/restaurant.entity';
import { DishEntity } from 'src/dish/dish.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RestaurantEntity, DishEntity])],
  providers: [RestaurantDishService],
})
export class RestaurantDishModule {}
