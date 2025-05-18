import { IsNotEmpty, IsString, IsUrl, MaxLength } from 'class-validator';

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
  @IsString()
  readonly kitchentype: string;

  @IsNotEmpty()
  @IsString()
  @IsUrl()
  readonly websiteurl: string[];
}
