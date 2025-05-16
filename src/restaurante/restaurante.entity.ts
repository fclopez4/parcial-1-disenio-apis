import { PlatoEntity } from 'src/plato/plato.entity';
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RestauranteEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  nombre: string;
  @Column()
  direccion: string;
  @Column()
  tipoCocina: string;
  @Column()
  paginaWeb: string;

  @ManyToMany(() => PlatoEntity, (plato) => plato.restaurantes)
  @JoinTable()
  platos: PlatoEntity[];
}
