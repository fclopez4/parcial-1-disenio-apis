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
    const dish = await this.dishRepository.findOne({
      where: { id: dishId },
    });
    if (!dish) {
      throw new BusinessLogicException('Dish not found', BusinessError.NOT_FOUND);
    }

    const restaurant = await this.restaurantRepository.findOne({
      where: { id: restaurantId },
      relations: ['dishes'],
    });
    if (!restaurant) {
      throw new BusinessLogicException('Restaurant not found', BusinessError.NOT_FOUND);
    }

    const restaurantDish = restaurant.dishes.find(
      (associatedDish) => associatedDish.id === dish.id,
    );
    if (!restaurantDish) {
      throw new BusinessLogicException(
        'Dish not found in the restaurant',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    return restaurantDish;
  }

  async updateDishesFromRestaurant(
    restaurantId: string,
    dishes: DishEntity[],
  ): Promise<RestaurantEntity> {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id: restaurantId },
      relations: ['dishes'],
    });
    if (!restaurant) {
      throw new BusinessLogicException('Restaurant not found', BusinessError.NOT_FOUND);
    }

    for (const dish of dishes) {
      const existingDish = await this.dishRepository.findOne({ where: { id: dish.id } });
      if (!existingDish) {
        throw new BusinessLogicException('Dish not found', BusinessError.NOT_FOUND);
      }
    }

    for (const dish of dishes) {
      const existingDish = restaurant.dishes.find(
        (associatedDish) => associatedDish.id === dish.id,
      );
      if (!existingDish) {
        throw new BusinessLogicException(
          'Dish not found in the restaurant',
          BusinessError.PRECONDITION_FAILED,
        );
      }
    }

    restaurant.dishes = dishes;
    return await this.restaurantRepository.save(restaurant);
  }

  async deleteDishFromRestaurant(restaurantId: string, dishId: string): Promise<RestaurantEntity> {
    const dish = await this.dishRepository.findOne({
      where: { id: dishId },
    });
    if (!dish) {
      throw new BusinessLogicException('Dish not found', BusinessError.NOT_FOUND);
    }

    const restaurant = await this.restaurantRepository.findOne({
      where: { id: restaurantId },
      relations: ['dishes'],
    });
    if (!restaurant) {
      throw new BusinessLogicException('Restaurant not found', BusinessError.NOT_FOUND);
    }

    const restaurantDish = restaurant.dishes.find(
      (associatedDish) => associatedDish.id === dish.id,
    );
    if (!restaurantDish) {
      throw new BusinessLogicException(
        'Dish not found in the restaurant',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    restaurant.dishes = restaurant.dishes.filter((e) => e.id !== dish.id);
    return this.restaurantRepository.save(restaurant);
  }
}
