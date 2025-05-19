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
    message: `kitchentype should be one of : ${Object.values(KitchenType).join(', ')}`,
  })
  readonly kitchentype: string;

  @IsNotEmpty()
  @IsString()
  @IsUrl()
  readonly websiteurl: string[];
}
