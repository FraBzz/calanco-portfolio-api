import { IsString, IsOptional, IsNumber, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductDto {
  @ApiProperty({
    description: 'Product name',
    example: 'Tastiera Gaming RGB',
    required: false
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Product description',
    example: 'Tastiera meccanica con illuminazione RGB personalizzabile',
    required: false
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Product price',
    example: 89.99,
    required: false
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price?: number;
}
