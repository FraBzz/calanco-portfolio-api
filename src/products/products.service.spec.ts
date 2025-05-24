import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { SupabaseService } from '../supabase/supabase.service';
import { IdGeneratorService } from '../common/services/id-generator.service';
import { CreateProductDto } from './dto/create-product.dto';

describe('ProductsService', () => {
  let service: ProductsService;
  let supabaseService: SupabaseService;
  let idGenerator: IdGeneratorService;

  const mockUuid = '123e4567-e89b-12d3-a456-426614174000';
  const mockProduct = {
    id: mockUuid,
    name: 'Test Product',
    description: 'Test Description',
    price: 99.99,
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockSupabaseClient = {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data: null }),
  };

  const mockSupabaseService = {
    getClient: jest.fn(() => mockSupabaseClient),
  };

  const mockIdGeneratorService = {
    generateId: jest.fn().mockReturnValue(mockUuid),
    validateId: jest.fn().mockReturnValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
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

    service = module.get<ProductsService>(ProductsService);
    supabaseService = module.get<SupabaseService>(SupabaseService);
    idGenerator = module.get<IdGeneratorService>(IdGeneratorService);

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('findAll', () => {
    it('should return all products', async () => {
      const mockProducts = [mockProduct];
      mockSupabaseClient.select.mockResolvedValueOnce({ data: mockProducts, error: null });

      const result = await service.findAll();

      expect(mockSupabaseService.getClient).toHaveBeenCalled();
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('products');
      expect(mockSupabaseClient.select).toHaveBeenCalledWith('*');
      expect(result).toEqual(mockProducts);
    });

    it('should handle empty result', async () => {
      mockSupabaseClient.select.mockResolvedValueOnce({ data: [], error: null });

      const result = await service.findAll();

      expect(result).toEqual([]);
    });

    it('should handle database error', async () => {
      mockSupabaseClient.select.mockResolvedValueOnce({ 
        error: { message: 'Database error' }, 
        data: null 
      });

      await expect(service.findAll()).rejects.toThrow('Database error');
    });
  });

  describe('findOne', () => {
    it('should return one product by id', async () => {
      mockSupabaseClient.eq.mockReturnThis();
      mockSupabaseClient.single.mockResolvedValueOnce({ data: mockProduct, error: null });

      const result = await service.findOne(mockUuid);

      expect(mockSupabaseService.getClient).toHaveBeenCalled();
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('products');
      expect(mockSupabaseClient.select).toHaveBeenCalledWith('*');
      expect(mockSupabaseClient.eq).toHaveBeenCalledWith('id', mockUuid);
      expect(result).toEqual(mockProduct);
    });

    it('should return null if product not found', async () => {
      mockSupabaseClient.eq.mockReturnThis();
      mockSupabaseClient.single.mockResolvedValueOnce({ data: null, error: null });

      const result = await service.findOne(mockUuid);

      expect(result).toBeNull();
    });

    it('should handle invalid UUID', async () => {
      mockIdGeneratorService.validateId.mockReturnValueOnce(false);

      await expect(service.findOne('invalid-id')).rejects.toThrow(
        'Invalid product ID format',
      );
    });
  });

  describe('create', () => {
    it('should create a product', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Test Product',
        description: 'Test Description',
        price: 99.99,
      };

      const expectedProduct = {
        ...createProductDto,
        id: mockUuid,
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      };

      mockSupabaseClient.select.mockReturnThis();
      mockSupabaseClient.single.mockResolvedValueOnce({ data: expectedProduct, error: null });

      const result = await service.create(createProductDto);

      expect(mockIdGeneratorService.generateId).toHaveBeenCalled();
      expect(mockSupabaseService.getClient).toHaveBeenCalled();
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('products');
      expect(mockSupabaseClient.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          id: mockUuid,
          ...createProductDto,
        }),
      );
      expect(result).toEqual(expectedProduct);
    });

    it('should handle creation error', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Test Product',
        description: 'Test Description',
        price: 99.99,
      };

      mockSupabaseClient.select.mockReturnThis();
      mockSupabaseClient.single.mockResolvedValueOnce({ 
        error: { message: 'Database error' }, 
        data: null 
      });

      await expect(service.create(createProductDto)).rejects.toThrow('Database error');
    });
  });
});
