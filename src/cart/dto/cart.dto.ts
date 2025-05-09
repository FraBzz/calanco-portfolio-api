import { CartLine } from '../entities/cartLine.entity';

export class CartDto {
  id: string;
  lines: { productId: number; quantity: number }[];

  constructor(id: string, lines: CartLine[]) {
    this.id = id;
    this.lines = lines.map((line) => ({
      productId: line.productId,
      quantity: line.quantity,
    }));
  }
}
