import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { SupabaseService } from '../supabase/supabase.service';
import { IdGeneratorService } from '../common/services/id-generator.service';

describe('OrdersService', () => {
  let service: OrdersService;
  let supabaseService: jest.Mocked<SupabaseService>;
  let idGeneratorService: jest.Mocked<IdGeneratorService>;

  const mockSupabaseClient = {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
  };

  beforeEach(async () => {
    const mockSupabaseService = {
      getClient: jest.fn(() => mockSupabaseClient),
    };    const mockIdGeneratorService = {
      generateId: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: SupabaseService,
          useValue: mockSupabaseService,
        },
        {
          provide: IdGeneratorService,
          useValue: mockIdGeneratorService,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    supabaseService = module.get<SupabaseService>(SupabaseService) as jest.Mocked<SupabaseService>;
    idGeneratorService = module.get<IdGeneratorService>(IdGeneratorService) as jest.Mocked<IdGeneratorService>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('checkout', () => {
    it('should successfully create an order from a cart', async () => {
      // Arrange
      const cartId = 'cart_123';
      const orderId = 'order_123';
      const lineId = 'line_123';

      const mockCartLines = [
        {
          id: 'cart_line_1',
          quantity: 2,
          products: {
            id: 'prod_1',
            name: 'Product 1',
            price: 25.00
          }
        }
      ];

      const mockOrder = {
        id: orderId,
        cart_id: cartId,
        total_amount: 50.00,
        status: 'completed',
        created_at: '2024-01-01T10:00:00Z'
      };

      const mockOrderLines = [
        {
          id: lineId,
          order_id: orderId,
          product_id: 'prod_1',
          quantity: 2,
          unit_price: 25.00,
          total_price: 50.00
        }
      ];

      const mockFinalOrder = {
        ...mockOrder,
        order_lines: mockOrderLines
      };

      idGeneratorService.generateId.mockReturnValueOnce(orderId).mockReturnValueOnce(lineId);

      // Mock cart lines query
      mockSupabaseClient.from.mockReturnValueOnce({
        select: jest.fn().mockReturnValueOnce({
          eq: jest.fn().mockResolvedValueOnce({
            data: mockCartLines,
            error: null
          })
        })
      });

      // Mock order creation
      mockSupabaseClient.from.mockReturnValueOnce({
        insert: jest.fn().mockReturnValueOnce({
          select: jest.fn().mockReturnValueOnce({
            single: jest.fn().mockResolvedValueOnce({
              data: mockOrder,
              error: null
            })
          })
        })
      });

      // Mock order lines creation
      mockSupabaseClient.from.mockReturnValueOnce({
        insert: jest.fn().mockReturnValueOnce({
          select: jest.fn().mockResolvedValueOnce({
            data: mockOrderLines,
            error: null
          })
        })
      });

      // Mock getOrder call
      mockSupabaseClient.from.mockReturnValueOnce({
        select: jest.fn().mockReturnValueOnce({
          eq: jest.fn().mockReturnValueOnce({
            single: jest.fn().mockResolvedValueOnce({
              data: mockFinalOrder,
              error: null
            })
          })
        })
      });

      // Act
      const result = await service.checkout({ cartId });

      // Assert
      expect(result).toEqual({
        id: orderId,
        cartId: cartId,
        totalAmount: 50.00,
        status: 'completed',
        createdAt: '2024-01-01T10:00:00Z',
        orderLines: [
          {
            id: lineId,
            productId: 'prod_1',
            quantity: 2,
            unitPrice: 25.00,
            subtotal: 50.00
          }
        ]
      });
    });

    it('should throw BadRequestException when cart is empty', async () => {
      // Arrange
      const cartId = 'empty_cart';

      mockSupabaseClient.from.mockReturnValueOnce({
        select: jest.fn().mockReturnValueOnce({
          eq: jest.fn().mockResolvedValueOnce({
            data: [],
            error: null
          })
        })
      });

      // Act & Assert
      await expect(service.checkout({ cartId })).rejects.toThrow(BadRequestException);
    });
  });

  describe('getOrder', () => {
    it('should return order with order lines', async () => {
      // Arrange
      const orderId = 'order_123';
      const mockOrder = {
        id: orderId,
        cart_id: 'cart_123',
        total_amount: 50.00,
        status: 'completed',
        created_at: '2024-01-01T10:00:00Z',
        order_lines: [
          {
            id: 'line_123',
            product_id: 'prod_1',
            quantity: 2,
            unit_price: 25.00,
            total_price: 50.00
          }
        ]
      };

      mockSupabaseClient.from.mockReturnValueOnce({
        select: jest.fn().mockReturnValueOnce({
          eq: jest.fn().mockReturnValueOnce({
            single: jest.fn().mockResolvedValueOnce({
              data: mockOrder,
              error: null
            })
          })
        })
      });

      // Act
      const result = await service.getOrder(orderId);

      // Assert
      expect(result).toEqual({
        id: orderId,
        cartId: 'cart_123',
        totalAmount: 50.00,
        status: 'completed',
        createdAt: '2024-01-01T10:00:00Z',
        orderLines: [
          {
            id: 'line_123',
            productId: 'prod_1',
            quantity: 2,
            unitPrice: 25.00,
            subtotal: 50.00
          }
        ]
      });
    });

    it('should throw NotFoundException when order does not exist', async () => {
      // Arrange
      const orderId = 'nonexistent_order';

      mockSupabaseClient.from.mockReturnValueOnce({
        select: jest.fn().mockReturnValueOnce({
          eq: jest.fn().mockReturnValueOnce({
            single: jest.fn().mockResolvedValueOnce({
              data: null,
              error: { message: 'No rows returned' }
            })
          })
        })
      });

      // Act & Assert
      await expect(service.getOrder(orderId)).rejects.toThrow(NotFoundException);
    });
  });
});
