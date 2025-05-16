import { RestaurantEntity } from '../restaurant/restaurant.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

export enum DishCategory {
  ENTRADA = 'entrada',
  PLATO_FUERTE = 'plato_fuerte',
  POSTRE = 'postre',
  BEBIDA = 'bebida',
}

@Entity()
export class DishEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @Column()
  description: string;
  @Column()
  cost: number;
  @Column({ type: 'enum', enum: DishCategory })
  category: DishCategory;

  @ManyToMany(() => RestaurantEntity, (restaurant) => restaurant.dishes)
  restaurants: RestaurantEntity[];
}
