import { Test, TestingModule } from '@nestjs/testing';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { IProductsService } from './interfaces/products.service.interface';
import { ProductsController } from './products.controller';
import { ApiResponseDto } from '../common/dto/api-response.dto';
import { NotFoundException } from '@nestjs/common';

describe('ProductsController', () => {
  let controller: ProductsController;

  const mockProducts = [
    {
      id: '1d40e473-e034-49f5-ac5d-980c7b7e7942',
      name: 'Tastiera',
      description: 'Meccanica RGB',
      price: 79.99,
    },
    {
      id: 'a35d7362-9466-4118-994d-1e1d846442fd',
      name: 'Mouse',
      description: 'Wireless ergonomico',
      price: 49.99,
    },
  ];  const mockProductsService: IProductsService = {
    findAll: jest.fn().mockResolvedValue(mockProducts),
    findOne: jest
      .fn()
      .mockImplementation(async (id: string) => {
        const product = mockProducts.find((p) => p.id === id);
        return product;
      }),
    create: jest
      .fn()
      .mockImplementation(async (dto: CreateProductDto) => ({
        id: 'new-generated-uuid',
        ...dto,
      })),
    update: jest
      .fn()
      .mockImplementation(async (id: string, dto: UpdateProductDto) => ({
        id,
        name: dto.name || 'Updated Product',
        description: dto.description || 'Updated Description',
        price: dto.price || 99.99,
      })),
    delete: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: 'IProductsService',
          useValue: mockProductsService,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all products', async () => {
    const response = await controller.getAllProducts();
    expect(response).toBeDefined();
    expect(response.type).toBe('success');
    expect(response.status).toBe(200);
    expect(response.data).toBeDefined();
    expect(response.data.length).toBe(2);
    expect(mockProductsService.findAll).toHaveBeenCalled();
  });

  it('should return one product', async () => {
    const productId = '1d40e473-e034-49f5-ac5d-980c7b7e7942';
    const response = await controller.getProduct(productId);
    expect(response).toBeDefined();
    expect(response.type).toBe('success');
    expect(response.status).toBe(200);
    expect(response.data).toBeDefined();
    expect(response.data.id).toBe(productId);
    expect(mockProductsService.findOne).toHaveBeenCalledWith(productId);
  });

  it('should throw NotFoundException if product not found', async () => {
    const nonExistingId = 'ffffffff-ffff-ffff-ffff-ffffffffffff';

    await expect(controller.getProduct(nonExistingId)).rejects.toThrow(
      NotFoundException,
    );
    expect(mockProductsService.findOne).toHaveBeenCalledWith(nonExistingId);
  });  it('should create a new product', async () => {
    const dto: CreateProductDto = {
      name: 'Microfono',
      description: 'Condensatore USB',
      price: 59.99,
    };

    const response = await controller.createProduct(dto);
    expect(response).toBeDefined();
    expect(response.type).toBe('success');
    expect(response.status).toBe(201);
    expect(response.data).toBeDefined();
    expect(response.data.id).toBe('new-generated-uuid');
    expect(response.data.name).toBe(dto.name);
    expect(response.data.description).toBe(dto.description);
    expect(response.data.price).toBe(dto.price);
    expect(mockProductsService.create).toHaveBeenCalledWith(dto);
  });

  it('should update a product successfully', async () => {
    const productId = '1d40e473-e034-49f5-ac5d-980c7b7e7942';
    const dto: UpdateProductDto = {
      name: 'Tastiera Aggiornata',
      price: 89.99,
    };

    const response = await controller.updateProduct(productId, dto);
    expect(response).toBeDefined();
    expect(response.type).toBe('success');
    expect(response.status).toBe(200);
    expect(response.data).toBeDefined();
    expect(response.data.id).toBe(productId);
    expect(response.message).toBe('Product updated successfully');
    expect(mockProductsService.update).toHaveBeenCalledWith(productId, dto);
  });

  it('should handle update errors when product not found', async () => {
    const nonExistingId = 'ffffffff-ffff-ffff-ffff-ffffffffffff';
    const dto: UpdateProductDto = { name: 'Updated Name' };
    (mockProductsService.update as jest.Mock).mockRejectedValueOnce(new Error('Product not found'));

    await expect(controller.updateProduct(nonExistingId, dto)).rejects.toThrow();
    expect(mockProductsService.update).toHaveBeenCalledWith(nonExistingId, dto);
  });

  it('should delete a product successfully', async () => {
    const productId = '1d40e473-e034-49f5-ac5d-980c7b7e7942';

    const response = await controller.deleteProduct(productId);
    expect(response).toBeDefined();
    expect(response.type).toBe('success');
    expect(response.status).toBe(200);
    expect(response.data).toBeNull();
    expect(response.message).toBe('Product deleted successfully');
    expect(mockProductsService.delete).toHaveBeenCalledWith(productId);
  });

  it('should handle delete errors when product not found', async () => {
    const nonExistingId = 'ffffffff-ffff-ffff-ffff-ffffffffffff';
    (mockProductsService.delete as jest.Mock).mockRejectedValueOnce(new Error('Product not found'));

    await expect(controller.deleteProduct(nonExistingId)).rejects.toThrow();
    expect(mockProductsService.delete).toHaveBeenCalledWith(nonExistingId);
  });
});
