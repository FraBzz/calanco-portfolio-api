export class OrderLine {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  createdAt: Date;

  constructor(partial: Partial<OrderLine>) {
    Object.assign(this, partial);
  }
}
