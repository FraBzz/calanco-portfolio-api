import { ApiProperty } from '@nestjs/swagger';
import { CartLine } from '../entities/cartLine.entity';

export class CartDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Cart ID' })
  id: string;

  @ApiProperty({ 
    example: [{ productId: '123e4567-e89b-12d3-a456-426614174000', quantity: 1 }],
    description: 'Cart lines' 
  })
  lines: { productId: string; quantity: number }[];

  constructor(id: string, lines: CartLine[]) {
    this.id = id;
    this.lines = lines.map((line) => ({
      productId: line.productId,
      quantity: line.quantity,
    }));
  }
}
