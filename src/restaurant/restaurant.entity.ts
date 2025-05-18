import { DishEntity } from '../dish/dish.entity';
import { Check, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

export enum KitchenType {
  ITALIANA = 'italiana',
  JAPONESA = 'japonesa',
  MEXICANA = 'mexicana',
  COLOMBIANA = 'colombiana',
  INDIA = 'india',
  INTERNACIONAL = 'internacional',
}

@Entity()
@Check(
  `kitchentype IN ('italiana', 'japonesa', 'mexicana', 'colombiana', 'india', 'internacional')`,
)
export class RestaurantEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @Column()
  address: string;
  @Column({
    type: 'text',
    transformer: {
      to: (value: KitchenType) => value,
      from: (value: string) => value as KitchenType,
    },
  })
  kitchentype: KitchenType;
  @Column()
  websiteurl: string;

  @ManyToMany(() => DishEntity, (dish) => dish.restaurants)
  @JoinTable()
  dishes: DishEntity[];
}
