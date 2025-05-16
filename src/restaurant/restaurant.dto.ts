import { IsEnum, IsNotEmpty, IsString, IsUrl, MaxLength } from 'class-validator';
import { KitchenType } from './restaurant.entity';

export class RestaurantDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  readonly address: string;

  @IsNotEmpty()
  @IsEnum(KitchenType, {
    message: `Tipo de cocina debe ser uno de: ${Object.values(KitchenType).join(', ')}`,
  })
  readonly kitchenType: KitchenType;

  @IsNotEmpty()
  @IsString()
  @IsUrl()
  readonly websiteUrl: string[];
}
