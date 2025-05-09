import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateProductDto } from './dto/create-product.dto';
import { IProductsService } from './interfaces/products.service.interface';
import { ProductsController } from './products.controller';

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
      .mockImplementation(async (id: string) =>
        mockProducts.find((p) => p.id === id),
      ),
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
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all products', async () => {
    const products = await controller.getAllProducts();
    expect(products).toBeDefined();
    expect(products.length).toBeGreaterThan(0);
    expect(mockProductsService.findAll).toHaveBeenCalled();
  });

  it('should return one product', async () => {
    const product = await controller.getProduct(
      '1d40e473-e034-49f5-ac5d-980c7b7e7942',
    );
    expect(product).toBeDefined();
    expect(product.id).toBe('1d40e473-e034-49f5-ac5d-980c7b7e7942');
    expect(mockProductsService.findOne).toHaveBeenCalledWith(
      '1d40e473-e034-49f5-ac5d-980c7b7e7942',
    );
  });

  it('should throw NotFoundException if product not found', async () => {
    const nonExistingId = 'ffffffff-ffff-ffff-ffff-ffffffffffff';
    jest.spyOn(mockProductsService, 'findOne').mockResolvedValueOnce(undefined);

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

    const newProduct = await controller.createProduct(dto);
    expect(newProduct).toBeDefined();
    expect(newProduct).toEqual({
      id: 'new-generated-uuid',
      ...dto,
    });
    expect(mockProductsService.create).toHaveBeenCalledWith(dto);
  });
});
