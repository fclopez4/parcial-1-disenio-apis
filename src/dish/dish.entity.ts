import { RestaurantEntity } from '../restaurant/restaurant.entity';
import { Check, Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

export enum DishCategory {
  ENTRADA = 'entrada',
  PLATO_FUERTE = 'plato_fuerte',
  POSTRE = 'postre',
  BEBIDA = 'bebida',
}

@Entity()
@Check(`category IN ('entrada', 'plato_fuerte', 'postre', 'bebida')`)
@Check(`cost > 0`)
export class DishEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @Column()
  description: string;
  @Column('decimal', { precision: 10, scale: 2 })
  cost: number;
  @Column({
    type: 'text',
    transformer: {
      to: (value: DishCategory) => value,
      from: (value: string) => value as DishCategory,
    },
  })
  category: DishCategory;

  @ManyToMany(() => RestaurantEntity, (restaurant) => restaurant.dishes)
  restaurants: RestaurantEntity[];
}
