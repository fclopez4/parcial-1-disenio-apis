import { IsEnum, IsNotEmpty, IsNumber, IsPositive, IsString, MaxLength } from 'class-validator';
import { DishCategory } from './dish.entity';

export class DishDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  readonly description: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  readonly cost: number;

  @IsNotEmpty()
  @IsEnum(DishCategory, {
    message: `Categoría debe ser uno de: ${Object.values(DishCategory).join(', ')}`,
  })
  readonly category: string;
}
