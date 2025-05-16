import { DishEntity } from '../dish/dish.entity';
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

export enum KitchenType {
  ITALIANA = 'italiana',
  JAPONESA = 'japonesa',
  MEXICANA = 'mexicana',
  COLOMBIANA = 'colombiana',
  INDIA = 'india',
  INTERNACIONAL = 'internacional',
}

@Entity()
export class RestaurantEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @Column()
  address: string;
  @Column({ type: 'enum', enum: KitchenType })
  kitchenType: KitchenType;
  @Column()
  websiteUrl: string;

  @ManyToMany(() => DishEntity, (dish) => dish.restaurants)
  @JoinTable()
  dishes: DishEntity[];
}
