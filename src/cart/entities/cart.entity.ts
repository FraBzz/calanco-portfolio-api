import { CartLine } from "./cartLine.entity";

export class Cart {
  id: string;
  lines: CartLine[];

  constructor(id: string) {
    this.id = id;
    this.lines = [];
  }
}
