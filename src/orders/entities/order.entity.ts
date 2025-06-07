export class Order {
  id: string;
  cartId?: string;
  totalAmount: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<Order>) {
    Object.assign(this, partial);
  }
}
