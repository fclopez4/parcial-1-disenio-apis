import { Module } from '@nestjs/common';
import { DishService } from './dish.service';
import { DishEntity } from './dish.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([DishEntity])],
  providers: [DishService],
})
export class DishModule {}
