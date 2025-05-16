import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RestaurantEntity } from '../restaurant/restaurant.entity';
import { Repository } from 'typeorm';
import { DishEntity } from '../dish/dish.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class RestaurantDishService {
  constructor(
    @InjectRepository(RestaurantEntity)
    private readonly restaurantRepository: Repository<RestaurantEntity>,
    @InjectRepository(DishEntity)
    private readonly dishRepository: Repository<DishEntity>,
  ) {}

  async addDishToRestaurant(restaurantId: string, dishId: string): Promise<RestaurantEntity> {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id: restaurantId },
      relations: ['dishes'],
    });
    if (!restaurant) {
      throw new BusinessLogicException('Restaurant not found', BusinessError.NOT_FOUND);
    }

    const dish = await this.dishRepository.findOne({
      where: { id: dishId },
    });
    if (!dish) {
      throw new BusinessLogicException('Dish not found', BusinessError.NOT_FOUND);
    }

    restaurant.dishes.push(dish);
    return await this.restaurantRepository.save(restaurant);
  }

  async findDishesFromRestaurant(restaurantId: string): Promise<DishEntity[]> {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id: restaurantId },
      relations: ['dishes'],
    });
    if (!restaurant) {
      throw new BusinessLogicException('Restaurant not found', BusinessError.NOT_FOUND);
    }

    return restaurant.dishes;
  }

  async findDishFromRestaurant(restaurantId: string, dishId: string): Promise<DishEntity> {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id: restaurantId },
      relations: ['dishes'],
    });
    if (!restaurant) {
      throw new BusinessLogicException('Restaurant not found', BusinessError.NOT_FOUND);
    }

    const dish = restaurant.dishes.find((dish) => dish.id === dishId);
    if (!dish) {
      throw new BusinessLogicException('Dish not found in the restaurant', BusinessError.NOT_FOUND);
    }

    return dish;
  }

  async updateDishesFromRestaurant(
    restaurantId: string,
    dishId: string,
    dish: DishEntity,
  ): Promise<DishEntity> {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id: restaurantId },
      relations: ['dishes'],
    });
    if (!restaurant) {
      throw new BusinessLogicException('Restaurant not found', BusinessError.NOT_FOUND);
    }

    const existingDish = restaurant.dishes.find((dish) => dish.id === dishId);
    if (!existingDish) {
      throw new BusinessLogicException('Dish not found in the restaurant', BusinessError.NOT_FOUND);
    }

    Object.assign(existingDish, dish);
    return await this.dishRepository.save(existingDish);
  }

  async deleteDishFromRestaurant(restaurantId: string, dishId: string): Promise<DishEntity> {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id: restaurantId },
      relations: ['dishes'],
    });
    if (!restaurant) {
      throw new BusinessLogicException('Restaurant not found', BusinessError.NOT_FOUND);
    }

    const dishIndex = restaurant.dishes.findIndex((dish) => dish.id === dishId);
    if (dishIndex === -1) {
      throw new BusinessLogicException('Dish not found in the restaurant', BusinessError.NOT_FOUND);
    }

    const [removedDish] = restaurant.dishes.splice(dishIndex, 1);
    await this.restaurantRepository.save(restaurant);
    return removedDish;
  }
}
