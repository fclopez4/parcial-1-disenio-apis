import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantDishService } from './restaurant-dish.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { DishEntity } from '../dish/dish.entity';
import { RestaurantEntity } from '../restaurant/restaurant.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('RestaurantDishService', () => {
  let service: RestaurantDishService;
  let restaurantRepository: Repository<RestaurantEntity>;
  let dishRepository: Repository<DishEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [RestaurantDishService],
    }).compile();

    service = module.get<RestaurantDishService>(RestaurantDishService);
    restaurantRepository = module.get<Repository<RestaurantEntity>>(
      getRepositoryToken(RestaurantEntity),
    );
    dishRepository = module.get<Repository<DishEntity>>(getRepositoryToken(DishEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(restaurantRepository).toBeDefined();
    expect(dishRepository).toBeDefined();
  });
});
