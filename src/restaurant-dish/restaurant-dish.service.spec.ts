import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantDishService } from './restaurant-dish.service';

describe('RestaurantDishService', () => {
  let service: RestaurantDishService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RestaurantDishService],
    }).compile();

    service = module.get<RestaurantDishService>(RestaurantDishService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
