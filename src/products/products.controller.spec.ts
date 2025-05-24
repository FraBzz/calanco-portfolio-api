import { Test, TestingModule } from '@nestjs/testing';
import { CreateProductDto } from './dto/create-product.dto';
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
  ];

  const mockProductsService: IProductsService = {
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
  });

  it('should create a new product', async () => {
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
});
