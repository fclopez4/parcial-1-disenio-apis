import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DishCategory, DishEntity } from './dish.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class DishService {
  constructor(
    @InjectRepository(DishEntity)
    private readonly dishRepository: Repository<DishEntity>,
  ) {}

  private validatePositiveCost(cost: number): void {
    if (cost <= 0) {
      throw new BusinessLogicException(
        'The cost must be a positive number',
        BusinessError.BAD_REQUEST,
      );
    }
  }

  private validateDishCategory(category: DishCategory): void {
    const validCategories = Object.values(DishCategory);
    if (!validCategories.includes(category)) {
      throw new BusinessLogicException(
        `The category must be one of the following: ${validCategories.join(', ')}`,
        BusinessError.BAD_REQUEST,
      );
    }
  }

  private validateDishFound(dish: DishEntity | null) {
    if (!dish) {
      throw new BusinessLogicException(
        'The dish with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
  }

  async findAll(): Promise<DishEntity[]> {
    return await this.dishRepository.find({
      relations: ['restaurants'],
    });
  }

  async findOne(id: string): Promise<DishEntity> {
    const dish = await this.dishRepository.findOne({
      where: { id },
      relations: ['restaurants'],
    });
    this.validateDishFound(dish);
    return dish!;
  }

  async create(dish: DishEntity): Promise<DishEntity> {
    this.validatePositiveCost(dish.cost);
    this.validateDishCategory(dish.category);
    return await this.dishRepository.save(dish);
  }

  async update(id: string, dish: DishEntity): Promise<DishEntity> {
    this.validatePositiveCost(dish.cost);
    this.validateDishCategory(dish.category);
    const existingDish = await this.findOne(id);
    this.validateDishFound(existingDish);
    return await this.dishRepository.save({ ...existingDish, ...dish });
  }

  async delete(id: string): Promise<DishEntity> {
    const dish = await this.findOne(id);
    this.validateDishFound(dish);
    return await this.dishRepository.remove(dish);
  }
}
