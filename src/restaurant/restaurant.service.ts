import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RestaurantEntity } from './restaurant.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(RestaurantEntity)
    private readonly restaurantRepository: Repository<RestaurantEntity>,
  ) {}

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
    if (!restaurant) {
      throw new BusinessLogicException(
        'The restaurant with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    return restaurant;
  }

  async create(restaurant: RestaurantEntity): Promise<RestaurantEntity> {
    return await this.restaurantRepository.save(restaurant);
  }

  async update(id: string, restaurant: RestaurantEntity): Promise<RestaurantEntity> {
    const existingRestaurant = await this.findOne(id);
    if (!existingRestaurant) {
      throw new BusinessLogicException(
        'The restaurant with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    return await this.restaurantRepository.save({ ...existingRestaurant, ...restaurant });
  }

  async delete(id: string): Promise<RestaurantEntity> {
    const restaurant = await this.findOne(id);
    if (!restaurant) {
      throw new BusinessLogicException(
        'The restaurant with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    return await this.restaurantRepository.remove(restaurant);
  }
}
