import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from './cart.service';
import { CartLine } from './entities/cartLine.entity';
import { BadRequestException } from '@nestjs/common';
import { IdGeneratorService } from '../common/services/id-generator.service';
import { IProductsService } from '../products/interfaces/products.service.interface';

describe('CartService', () => {
  let service: CartService;
  let idGenerator: IdGeneratorService;
  let productsService: IProductsService;

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
      ],
    }).compile();

    service = module.get<CartService>(CartService);
    idGenerator = module.get<IdGeneratorService>(IdGeneratorService);
    productsService = module.get<IProductsService>('IProductsService');

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createCart', () => {
    it('should create a new cart with generated UUID', () => {
      const cart = service.createCart();
      expect(idGenerator.generateId).toHaveBeenCalled();
      expect(cart.id).toBe(mockUuid);
      expect(cart.lines).toEqual([]);
    });
  });

  describe('getCart', () => {
    it('should throw error if cart ID is invalid', () => {
      const invalidId = 'invalid-id';
      expect(() => service.getCart(invalidId)).toThrow(BadRequestException);
      expect(idGenerator.validateId).toHaveBeenCalledWith(invalidId);
    });

    it('should throw error if cart is not found', () => {
      expect(() => service.getCart(mockUuid)).toThrow(BadRequestException);
    });

    it('should return cart if it exists', () => {
      // Create a cart first
      const newCart = service.createCart();
      const cart = service.getCart(newCart.id);
      expect(cart).toBeDefined();
      expect(cart.id).toBe(newCart.id);
    });
  });

  describe('addToCart', () => {
    it('should throw error if cart ID is invalid', async () => {
      const invalidId = 'invalid-id';
      const item: CartLine = { productId: mockProductId, quantity: 1 };
      await expect(service.addToCart(invalidId, item)).rejects.toThrow(BadRequestException);
      expect(idGenerator.validateId).toHaveBeenCalledWith(invalidId);
      expect(productsService.findOne).not.toHaveBeenCalled();
    });

    it('should throw error if product ID is invalid', async () => {
      const cart = service.createCart();
      const invalidProductId = 'invalid-product-id';
      const item: CartLine = { productId: invalidProductId, quantity: 1 };
      
      await expect(service.addToCart(cart.id, item)).rejects.toThrow('Product not found');
      expect(productsService.findOne).toHaveBeenCalledWith(invalidProductId);
    });

    it('should add new item to cart', async () => {
      const cart = service.createCart();
      const item: CartLine = { productId: mockProductId, quantity: 1 };
      
      await service.addToCart(cart.id, item);
      
      expect(productsService.findOne).toHaveBeenCalledWith(mockProductId);
      const updatedCart = service.getCart(cart.id);
      expect(updatedCart.lines).toHaveLength(1);
      expect(updatedCart.lines[0]).toEqual(item);
    });

    it('should update quantity if item already exists', async () => {
      const cart = service.createCart();
      const item: CartLine = { productId: mockProductId, quantity: 1 };
      
      await service.addToCart(cart.id, item);
      await service.addToCart(cart.id, item);
      
      expect(productsService.findOne).toHaveBeenCalledTimes(2);
      expect(productsService.findOne).toHaveBeenCalledWith(mockProductId);
      const updatedCart = service.getCart(cart.id);
      expect(updatedCart.lines).toHaveLength(1);
      expect(updatedCart.lines[0].quantity).toBe(2);
    });
  });

  describe('removeFromCart', () => {
    it('should throw error if cart ID is invalid', () => {
      const invalidId = 'invalid-id';
      expect(() => service.removeFromCart(invalidId, mockProductId)).toThrow(BadRequestException);
      expect(idGenerator.validateId).toHaveBeenCalledWith(invalidId);
    });

    it('should remove item from cart', async () => {
      const cart = service.createCart();
      const item: CartLine = { productId: mockProductId, quantity: 1 };
      
      await service.addToCart(cart.id, item);
      service.removeFromCart(cart.id, mockProductId);
      
      const updatedCart = service.getCart(cart.id);
      expect(updatedCart.lines).toHaveLength(0);
    });

    it('should not throw if product does not exist in cart', () => {
      const cart = service.createCart();
      expect(() => service.removeFromCart(cart.id, mockProductId)).not.toThrow();
    });
  });

  describe('clearCart', () => {
    it('should throw error if cart ID is invalid', () => {
      const invalidId = 'invalid-id';
      expect(() => service.clearCart(invalidId)).toThrow(BadRequestException);
      expect(idGenerator.validateId).toHaveBeenCalledWith(invalidId);
    });

    it('should clear all items from cart', async () => {
      const cart = service.createCart();
      const item: CartLine = { productId: mockProductId, quantity: 1 };
      
      await service.addToCart(cart.id, item);
      service.clearCart(cart.id);
      
      const updatedCart = service.getCart(cart.id);
      expect(updatedCart.lines).toHaveLength(0);
    });
  });
});
