import { Test, TestingModule } from '@nestjs/testing';
import { HttpException } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { IOrdersService } from './orders.interface';
import { CheckoutDto, OrderResponseDto } from './dto/checkout.dto';

describe('OrdersController', () => {
  let controller: OrdersController;
  let ordersService: jest.Mocked<IOrdersService>;

  const mockOrderResponse: OrderResponseDto = {
    id: 'order_123',
    cartId: 'cart_123',
    totalAmount: 99.98,
    status: 'confirmed',
    createdAt: '2024-01-01T10:00:00Z',
    orderLines: [
      {
        id: 'line_123',
        productId: 'prod_1',
        quantity: 2,
        unitPrice: 49.99,
        subtotal: 99.98
      }
    ]
  };

  beforeEach(async () => {
    const mockOrdersService = {
      checkout: jest.fn(),
      getOrder: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: 'IOrdersService',
          useValue: mockOrdersService,
        },
      ],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
    ordersService = module.get<IOrdersService>('IOrdersService') as jest.Mocked<IOrdersService>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('checkout', () => {
    it('should successfully checkout a cart', async () => {
      // Arrange
      const checkoutDto: CheckoutDto = { cartId: 'cart_123' };
      ordersService.checkout.mockResolvedValue(mockOrderResponse);

      // Act
      const result = await controller.checkout(checkoutDto);

      // Assert
      expect(result).toEqual({
        type: 'success',
        data: mockOrderResponse,
        status: 201,
        message: 'Order created successfully',
        timestamp: expect.any(Date)
      });
      expect(ordersService.checkout).toHaveBeenCalledWith(checkoutDto);
      expect(ordersService.checkout).toHaveBeenCalledTimes(1);
    });

    it('should handle checkout errors', async () => {
      // Arrange
      const checkoutDto: CheckoutDto = { cartId: 'invalid_cart' };
      const error = new Error('Cart not found');
      ordersService.checkout.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.checkout(checkoutDto)).rejects.toThrow(HttpException);
    });
  });
  describe('getOrder', () => {
    it('should return an order by ID', async () => {
      // Arrange
      const orderId = 'order_123';
      ordersService.getOrder.mockResolvedValue(mockOrderResponse);

      // Act
      const result = await controller.getOrder(orderId);

      // Assert
      expect(result).toEqual({
        type: 'success',
        data: mockOrderResponse,
        status: 200,
        message: 'Order retrieved successfully',
        timestamp: expect.any(Date)
      });
      expect(ordersService.getOrder).toHaveBeenCalledWith(orderId);
      expect(ordersService.getOrder).toHaveBeenCalledTimes(1);
    });

    it('should handle get order errors', async () => {
      // Arrange
      const orderId = 'nonexistent_order';
      const error = new Error('Order not found');
      ordersService.getOrder.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.getOrder(orderId)).rejects.toThrow(HttpException);
    });
  });
});
