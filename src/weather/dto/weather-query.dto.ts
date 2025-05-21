import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class WeatherQueryDto {
  @ApiProperty({ example: 'Roma' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ example: 3, type: Number, required: false })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  //aggiungo tansform per trasformare il parametro che normalmente è stringa in numero
  days?: number;
}
