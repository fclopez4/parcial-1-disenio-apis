import { TypeOrmModule } from '@nestjs/typeorm';
import { DishEntity } from '../../dish/dish.entity';
import { RestaurantEntity } from '../../restaurant/restaurant.entity';

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [RestaurantEntity, DishEntity],
    synchronize: true,
  }),
  TypeOrmModule.forFeature([RestaurantEntity, DishEntity]),
];
