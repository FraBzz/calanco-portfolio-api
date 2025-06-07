export class Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  created_at?: Date;
  updated_at?: Date;

  constructor(id: string, name: string, description: string, price: number) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.created_at = new Date();
    this.updated_at = new Date();
  }
}
