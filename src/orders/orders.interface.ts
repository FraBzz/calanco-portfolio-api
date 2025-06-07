import { OrderResponseDto, CheckoutDto } from './dto/checkout.dto';

export interface IOrdersService {
  checkout(checkoutDto: CheckoutDto): Promise<OrderResponseDto>;
  getOrder(orderId: string): Promise<OrderResponseDto>;
}
