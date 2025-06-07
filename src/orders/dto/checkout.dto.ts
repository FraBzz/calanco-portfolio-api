import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '../types/order-status.type';

export class CheckoutDto {
  @ApiProperty({
    description: 'ID of the cart to checkout',
    example: 'cart_123456789'
  })
  @IsString()
  @IsNotEmpty()
  cartId: string;
}

export class OrderResponseDto {
  @ApiProperty({
    description: 'Order ID',
    example: 'order_123456789'
  })
  id: string;

  @ApiProperty({
    description: 'Cart ID that was used for this order',
    example: 'cart_123456789'
  })
  cartId: string;

  @ApiProperty({
    description: 'Total amount of the order',
    example: 129.99
  })
  totalAmount: number;
  @ApiProperty({
    description: 'Status of the order',
    example: 'confirmed',
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']
  })
  status: OrderStatus;

  @ApiProperty({
    description: 'List of order lines',
    type: [Object]
  })
  orderLines: OrderLineDto[];

  @ApiProperty({
    description: 'Order creation date',
    example: '2024-01-01T10:00:00Z'
  })
  createdAt: string;
}

export class OrderLineDto {
  @ApiProperty({
    description: 'Order line ID',
    example: 'line_123456789'
  })
  id: string;

  @ApiProperty({
    description: 'Product ID',
    example: 'prod_123456789'
  })
  productId: string;

  @ApiProperty({
    description: 'Quantity ordered',
    example: 2
  })
  quantity: number;

  @ApiProperty({
    description: 'Unit price at time of order',
    example: 49.99
  })
  unitPrice: number;

  @ApiProperty({
    description: 'Total price for this line (quantity * unitPrice)',
    example: 99.98
  })
  subtotal: number;
}
