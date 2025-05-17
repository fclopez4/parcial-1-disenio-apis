import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { KitchenType, RestaurantEntity } from './restaurant.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(RestaurantEntity)
    private readonly restaurantRepository: Repository<RestaurantEntity>,
  ) {}

  private validateRestaurantFound(restaurant: RestaurantEntity | null) {
    if (!restaurant) {
      throw new BusinessLogicException(
        'The restaurant with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
  }

  private validateKitchenType(kitchenType: KitchenType): void {
    const validKitchenTypes = Object.values(KitchenType);
    if (!validKitchenTypes.includes(kitchenType)) {
      throw new BusinessLogicException(
        `The kitchen type must be one of the following: ${validKitchenTypes.join(', ')}`,
        BusinessError.BAD_REQUEST,
      );
    }
  }

  async findAll(): Promise<RestaurantEntity[]> {
    return await this.restaurantRepository.find({
      relations: ['dishes'],
    });
  }

  async findOne(id: string): Promise<RestaurantEntity> {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id },
      relations: ['dishes'],
    });
    this.validateRestaurantFound(restaurant);
    return restaurant!;
  }

  async create(restaurant: RestaurantEntity): Promise<RestaurantEntity> {
    this.validateKitchenType(restaurant.kitchenType);
    return await this.restaurantRepository.save(restaurant);
  }

  async update(id: string, restaurant: RestaurantEntity): Promise<RestaurantEntity> {
    this.validateKitchenType(restaurant.kitchenType);
    const existingRestaurant = await this.findOne(id);
    this.validateRestaurantFound(existingRestaurant);
    return await this.restaurantRepository.save({ ...existingRestaurant, ...restaurant });
  }

  async delete(id: string): Promise<RestaurantEntity> {
    const restaurant = await this.findOne(id);
    this.validateRestaurantFound(restaurant);
    return await this.restaurantRepository.remove(restaurant);
  }
}
