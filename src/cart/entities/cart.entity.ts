import { CartLine } from "./cartLine.entity";

export class Cart {
  id: string;
  lines: CartLine[];
  createdAt: Date;
  updatedAt: Date;

  constructor(id?: string) {
    this.id = id;
    this.lines = [];
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  updateTimestamp() {
    this.updatedAt = new Date();
  }
}
