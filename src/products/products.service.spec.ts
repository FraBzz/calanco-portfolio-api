import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { SupabaseService } from '../supabase/supabase.service';
import { IdGeneratorService } from '../common/services/id-generator.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

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
  };  const mockSupabaseClient = {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data: null, error: null }),
  };

  const mockSupabaseService = {
    getClient: jest.fn(() => mockSupabaseClient),
  };

  const mockIdGeneratorService = {
    generateId: jest.fn().mockReturnValue(mockUuid),
    validateId: jest.fn().mockReturnValue(true),
  };  beforeEach(async () => {
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
    mockIdGeneratorService.validateId.mockReturnValue(true);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });  describe('findAll', () => {
    it('should return all products', async () => {
      const mockProducts = [mockProduct];
      mockSupabaseClient.from.mockReturnValueOnce({
        select: jest.fn().mockResolvedValue({ data: mockProducts, error: null })
      });

      const result = await service.findAll();

      expect(mockSupabaseService.getClient).toHaveBeenCalled();
      expect(result).toEqual(mockProducts);
    });

    it('should handle empty result', async () => {
      mockSupabaseClient.from.mockReturnValueOnce({
        select: jest.fn().mockResolvedValue({ data: [], error: null })
      });

      const result = await service.findAll();

      expect(result).toEqual([]);
    });

    it('should handle database error', async () => {
      mockSupabaseClient.from.mockReturnValueOnce({
        select: jest.fn().mockResolvedValue({ 
          error: { message: 'Database error' }, 
          data: null 
        })
      });

      await expect(service.findAll()).rejects.toThrow('Database error');
    });
  });
  describe('findOne', () => {
    it('should return one product by id', async () => {
      mockSupabaseClient.from.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: mockProduct, error: null })
          })
        })
      });

      const result = await service.findOne(mockUuid);

      expect(mockSupabaseService.getClient).toHaveBeenCalled();
      expect(result).toEqual(mockProduct);
    });

    it('should return null if product not found', async () => {
      mockSupabaseClient.from.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: null, error: null })
          })
        })
      });

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

      mockSupabaseClient.from.mockReturnValueOnce({
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: expectedProduct, error: null })
          })
        })
      });

      const result = await service.create(createProductDto);

      expect(mockIdGeneratorService.generateId).toHaveBeenCalled();
      expect(mockSupabaseService.getClient).toHaveBeenCalled();
      expect(result).toEqual(expectedProduct);
    });

    it('should handle creation error', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Test Product',
        description: 'Test Description',
        price: 99.99,
      };

      mockSupabaseClient.from.mockReturnValueOnce({
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ 
              error: { message: 'Database error' }, 
              data: null 
            })
          })
        })
      });

      await expect(service.create(createProductDto)).rejects.toThrow('Database error');
    });
  });

  describe('delete', () => {
    it('should delete a product successfully', async () => {
      const productId = mockUuid;
      const mockProduct = { id: productId, name: 'Test Product' };

      // Mock the findOne chain (for checking if product exists)
      mockSupabaseClient.from.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: mockProduct, error: null })
          })
        })
      });

      // Mock the delete chain
      mockSupabaseClient.from.mockReturnValueOnce({
        delete: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({ error: null })
        })
      });

      await service.delete(productId);

      expect(mockIdGeneratorService.validateId).toHaveBeenCalledWith(productId);
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('products');
    });

    it('should throw error for invalid product ID', async () => {
      mockIdGeneratorService.validateId.mockReturnValueOnce(false);

      await expect(service.delete('invalid-id')).rejects.toThrow(
        'Invalid product ID format',
      );
    });

    it('should throw error when product not found', async () => {
      // Mock findOne to return null (product not found)
      mockSupabaseClient.from.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: null, error: null })
          })
        })
      });

      await expect(service.delete(mockUuid)).rejects.toThrow('Product not found');
    });

    it('should handle delete database error', async () => {
      const mockProduct = { id: mockUuid, name: 'Test Product' };

      // Mock findOne to return a product
      mockSupabaseClient.from.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: mockProduct, error: null })
          })
        })
      });

      // Mock delete operation with error
      mockSupabaseClient.from.mockReturnValueOnce({
        delete: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({ error: { message: 'Delete failed' } })
        })
      });

      await expect(service.delete(mockUuid)).rejects.toThrow('Database error: Delete failed');
    });
  });
  
  describe('update', () => {
    const updateProductDto: UpdateProductDto = {
      name: 'Updated Product',
      price: 149.99,
    };

    it('should update a product successfully', async () => {
      const updatedProduct = {
        ...mockProduct,
        ...updateProductDto,
        updated_at: new Date(),
      };

      // Mock findOne to return existing product
      mockSupabaseClient.from.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: mockProduct, error: null })
          })
        })
      });

      // Mock update operation
      mockSupabaseClient.from.mockReturnValueOnce({
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            select: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({ data: updatedProduct, error: null })
            })
          })
        })
      });

      const result = await service.update(mockUuid, updateProductDto);

      expect(mockIdGeneratorService.validateId).toHaveBeenCalledWith(mockUuid);
      expect(result).toEqual(updatedProduct);
    });

    it('should throw error for invalid product ID', async () => {
      mockIdGeneratorService.validateId.mockReturnValueOnce(false);

      await expect(service.update('invalid-id', updateProductDto)).rejects.toThrow(
        'Invalid product ID format',
      );
    });

    it('should throw error when product not found', async () => {
      // Mock findOne to return null (product not found)
      mockSupabaseClient.from.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: null, error: null })
          })
        })
      });

      await expect(service.update(mockUuid, updateProductDto)).rejects.toThrow('Product not found');
    });

    it('should handle update database error', async () => {
      // Mock findOne to return existing product
      mockSupabaseClient.from.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: mockProduct, error: null })
          })
        })
      });

      // Mock update operation with error
      mockSupabaseClient.from.mockReturnValueOnce({
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            select: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({ 
                error: { message: 'Update failed' }, 
                data: null 
              })
            })
          })
        })
      });

      await expect(service.update(mockUuid, updateProductDto)).rejects.toThrow('Database error: Update failed');
    });

    it('should handle partial updates', async () => {
      const partialUpdate: UpdateProductDto = {
        name: 'Only Name Updated',
      };

      const updatedProduct = {
        ...mockProduct,
        name: 'Only Name Updated',
        updated_at: new Date(),
      };

      // Mock findOne to return existing product
      mockSupabaseClient.from.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: mockProduct, error: null })
          })
        })
      });

      // Mock update operation
      mockSupabaseClient.from.mockReturnValueOnce({
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            select: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({ data: updatedProduct, error: null })
            })
          })
        })
      });

      const result = await service.update(mockUuid, partialUpdate);

      expect(result.name).toBe('Only Name Updated');
    });
  });
});
