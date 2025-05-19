import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { RestaurantDishService } from './restaurant-dish.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { DishDto } from 'src/dish/dish.dto';
import { plainToInstance } from 'class-transformer';
import { DishEntity } from 'src/dish/dish.entity';

@Controller('restaurants')
@UseInterceptors(BusinessErrorsInterceptor)
export class RestaurantDishController {
  constructor(private readonly restaurantDishService: RestaurantDishService) {}

  @Post(':restaurantId/dishes/:dishId')
  async addDishToRestaurant(
    @Param('restaurantId') restaurantId: string,
    @Param('dishId') dishId: string,
  ) {
    return await this.restaurantDishService.addDishToRestaurant(restaurantId, dishId);
  }

  @Get(':restaurantId/dishes')
  async findDishesFromRestaurant(@Param('restaurantId') restaurantId: string) {
    return await this.restaurantDishService.findDishesFromRestaurant(restaurantId);
  }

  @Get(':restaurantId/dishes/:dishId')
  async findDishFromRestaurant(
    @Param('restaurantId') restaurantId: string,
    @Param('dishId') dishId: string,
  ) {
    return await this.restaurantDishService.findDishFromRestaurant(restaurantId, dishId);
  }

  @Put(':restaurantId/dishes')
  async updateDishFromRestaurant(
    @Param('restaurantId') restaurantId: string,
    @Body() dishDto: DishDto[],
  ) {
    const dishes = plainToInstance(DishEntity, dishDto);
    return await this.restaurantDishService.updateDishesFromRestaurant(restaurantId, dishes);
  }

  @Delete(':restaurantId/dishes/:dishId')
  @HttpCode(204)
  async deleteDishFromRestaurant(
    @Param('restaurantId') restaurantId: string,
    @Param('dishId') dishId: string,
  ) {
    return await this.restaurantDishService.deleteDishFromRestaurant(restaurantId, dishId);
  }
}
