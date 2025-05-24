import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from './cart.service';
import { CartLine } from './entities/cartLine.entity';
import { BadRequestException } from '@nestjs/common';
import { IdGeneratorService } from '../common/services/id-generator.service';
import { IProductsService } from '../products/interfaces/products.service.interface';
import { SupabaseService } from '../supabase/supabase.service';

describe('CartService', () => {
  let service: CartService;
  let idGenerator: IdGeneratorService;
  let productsService: IProductsService;
  let supabaseService: SupabaseService;

  const mockUuid = '123e4567-e89b-12d3-a456-426614174000';
  const mockProductId = '123e4567-e89b-12d3-a456-426614174001';

  const mockIdGeneratorService = {
    generateId: jest.fn().mockReturnValue(mockUuid),
    validateId: jest.fn().mockImplementation((id: string) => id === mockUuid || id === mockProductId),
  };

  const mockProductsService = {
    findOne: jest.fn().mockImplementation((id: string) => {
      if (id === mockProductId) {
        return Promise.resolve({ id: mockProductId, name: 'Test Product' });
      }
      return Promise.reject(new BadRequestException('Product not found'));
    }),
    findAll: jest.fn(),
    create: jest.fn(),
  };  const mockSupabaseClient = {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockImplementation((data) => {
      mockSupabaseClient.insertData = data;
      return mockSupabaseClient;
    }),
    update: jest.fn().mockImplementation((data) => {
      mockSupabaseClient.updateData = data;
      const mock = {
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null, error: null })
      };
      return mock;
    }),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockImplementation(() => {
      return Promise.resolve({ data: null, error: null });
    }),
    // Mock for queries that don't use .single() - this will be the default behavior
    then: jest.fn((callback) => {
      return callback({ data: [], error: null });
    }),
    // Allow overriding the mock response
    _mockResponse: { data: [], error: null },
    insertData: null,  // Per tracciare i dati inseriti
    updateData: null   // Per tracciare i dati aggiornati
  };

  const mockSupabaseService = {
    getClient: jest.fn(() => mockSupabaseClient),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: IdGeneratorService,
          useValue: mockIdGeneratorService,
        },
        {
          provide: 'IProductsService',
          useValue: mockProductsService,
        },
        {
          provide: SupabaseService,
          useValue: mockSupabaseService,
        },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
    idGenerator = module.get<IdGeneratorService>(IdGeneratorService);
    productsService = module.get<IProductsService>('IProductsService');
    supabaseService = module.get<SupabaseService>(SupabaseService);

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createCart', () => {
    it('should create a new cart with generated UUID', async () => {
      mockSupabaseClient.single.mockResolvedValueOnce({
        data: { id: mockUuid, created_at: new Date(), updated_at: new Date() },
        error: null
      });

      const cart = await service.createCart();

      expect(idGenerator.generateId).toHaveBeenCalled();
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('carts');
      expect(mockSupabaseClient.insert).toHaveBeenCalledWith(expect.objectContaining({
        id: mockUuid
      }));
      expect(cart.id).toBe(mockUuid);
      expect(cart.lines).toEqual([]);
    });
  });

  describe('getCart', () => {
    it('should throw error if cart ID is invalid', async () => {
      const invalidId = 'invalid-id';
      await expect(service.getCart(invalidId)).rejects.toThrow(BadRequestException);
      expect(idGenerator.validateId).toHaveBeenCalledWith(invalidId);
    });     it('should throw error if cart is not found', async () => {
      jest.clearAllMocks();
      
      // Mock the cart query to return empty array
      mockSupabaseClient.eq.mockImplementationOnce(() => 
        Promise.resolve({ data: [], error: null })
      );

      await expect(service.getCart(mockUuid)).rejects.toThrow(BadRequestException);
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('carts');
      expect(mockSupabaseClient.select).toHaveBeenCalledWith('*');
      expect(mockSupabaseClient.eq).toHaveBeenCalledWith('id', mockUuid);
    });    it('should return cart if it exists', async () => {
      const mockCart = { id: mockUuid, created_at: new Date(), updated_at: new Date() };
      jest.clearAllMocks();
      
      mockSupabaseClient.eq
        .mockImplementationOnce(() => Promise.resolve({ data: [mockCart], error: null }))  // For cart query
        .mockImplementationOnce(() => Promise.resolve({ data: [], error: null }));         // For lines query

      const cart = await service.getCart(mockUuid);
      expect(cart).toBeDefined();
      expect(cart.id).toBe(mockUuid);
      expect(cart.lines).toEqual([]);
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('carts');
      expect(mockSupabaseClient.select).toHaveBeenCalledWith('*');
      expect(mockSupabaseClient.eq).toHaveBeenCalledWith('id', mockUuid);
    });
  });

  describe('addToCart', () => {
    const mockCartData = { id: mockUuid, created_at: new Date(), updated_at: new Date() };
    beforeEach(() => {
      jest.clearAllMocks();
      mockSupabaseClient.single.mockReset();
      mockSupabaseClient.insertData = null;
      mockSupabaseClient.updateData = null;
    });    it('should throw error if cart ID is invalid', async () => {
      const invalidId = 'invalid-id';
      const item: CartLine = { productId: mockProductId, quantity: 1 };
      await expect(service.addToCart(invalidId, item)).rejects.toThrow(BadRequestException);
      expect(idGenerator.validateId).toHaveBeenCalledWith(invalidId);
      expect(productsService.findOne).not.toHaveBeenCalled();
    });    it('should create cart if it does not exist and add item', async () => {
      const item: CartLine = { productId: mockProductId, quantity: 1 };
      jest.clearAllMocks();

      // Mock cart check (cart doesn't exist)
      mockSupabaseClient.eq
        .mockImplementationOnce(() => Promise.resolve({ data: [], error: null }))  // Cart check returns empty
        .mockImplementationOnce(() => ({ 
          eq: jest.fn().mockImplementation(() => Promise.resolve({ data: [], error: null }))  // Cart lines check returns empty
        }));

      // Mock cart creation
      mockSupabaseClient.insert.mockReturnValueOnce({
        then: jest.fn((callback) => callback({ data: null, error: null }))
      });

      // Mock cart lines insert
      mockSupabaseClient.insert.mockReturnValueOnce({
        then: jest.fn((callback) => callback({ data: null, error: null }))
      });

      await service.addToCart(mockUuid, item);

      expect(productsService.findOne).toHaveBeenCalledWith(mockProductId);
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('carts');
      expect(mockSupabaseClient.insert).toHaveBeenCalledWith(expect.objectContaining({
        id: mockUuid
      }));
    });

    it('should add item to existing cart', async () => {
      const item: CartLine = { productId: mockProductId, quantity: 1 };
      jest.clearAllMocks();

      // Mock cart check (cart exists)
      mockSupabaseClient.eq
        .mockImplementationOnce(() => Promise.resolve({ data: [mockCartData], error: null }))  // Cart exists
        .mockImplementationOnce(() => ({ 
          eq: jest.fn().mockImplementation(() => Promise.resolve({ data: [], error: null }))  // No existing cart lines
        }));

      await service.addToCart(mockUuid, item);

      expect(productsService.findOne).toHaveBeenCalledWith(mockProductId);
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('cart_lines');
    });});

  describe('removeFromCart', () => {
    beforeEach(() => {
      mockSupabaseClient.single.mockResolvedValueOnce({
        data: { id: mockUuid, created_at: new Date(), updated_at: new Date() },
        error: null
      });
    });

    it('should throw error if cart ID is invalid', async () => {
      const invalidId = 'invalid-id';
      await expect(service.removeFromCart(invalidId, mockProductId)).rejects.toThrow(BadRequestException);
      expect(idGenerator.validateId).toHaveBeenCalledWith(invalidId);
    });

    it('should remove item from cart', async () => {
      await service.removeFromCart(mockUuid, mockProductId);

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('cart_lines');
      expect(mockSupabaseClient.delete).toHaveBeenCalled();
      expect(mockSupabaseClient.eq).toHaveBeenCalledWith('cart_id', mockUuid);
    });
  });

  describe('clearCart', () => {
    beforeEach(() => {
      mockSupabaseClient.single.mockResolvedValueOnce({
        data: { id: mockUuid, created_at: new Date(), updated_at: new Date() },
        error: null
      });
    });

    it('should throw error if cart ID is invalid', async () => {
      const invalidId = 'invalid-id';
      await expect(service.clearCart(invalidId)).rejects.toThrow(BadRequestException);
      expect(idGenerator.validateId).toHaveBeenCalledWith(invalidId);
    });

    it('should clear all items from cart', async () => {
      await service.clearCart(mockUuid);

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('cart_lines');
      expect(mockSupabaseClient.delete).toHaveBeenCalled();
      expect(mockSupabaseClient.eq).toHaveBeenCalledWith('cart_id', mockUuid);
    });
  });
});
