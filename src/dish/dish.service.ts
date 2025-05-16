import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DishEntity } from './dish.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class DishService {
  constructor(
    @InjectRepository(DishEntity)
    private readonly dishRepository: Repository<DishEntity>,
  ) {}

  async findAll(): Promise<DishEntity[]> {
    return await this.dishRepository.find({
      relations: ['restaurant'],
    });
  }

  async findOne(id: string): Promise<DishEntity> {
    const dish = await this.dishRepository.findOne({
      where: { id },
      relations: ['restaurant'],
    });
    if (!dish) {
      throw new BusinessLogicException(
        'The dish with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    return dish;
  }

  async create(dish: DishEntity): Promise<DishEntity> {
    return await this.dishRepository.save(dish);
  }

  async update(id: string, dish: DishEntity): Promise<DishEntity> {
    const existingDish = await this.findOne(id);
    if (!existingDish) {
      throw new BusinessLogicException(
        'The dish with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    return await this.dishRepository.save({ ...existingDish, ...dish });
  }

  async delete(id: string): Promise<DishEntity> {
    const dish = await this.findOne(id);
    if (!dish) {
      throw new BusinessLogicException(
        'The dish with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    return await this.dishRepository.remove(dish);
  }
}
