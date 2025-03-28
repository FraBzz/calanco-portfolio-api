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

  // Mock minimale del tuo servizio
  const mockProductsService: IProductsService = {
    findAll: jest.fn().mockReturnValue(mockProducts),
    findOne: jest
      .fn()
      .mockImplementation((id: string) =>
        mockProducts.find((p) => p.id === id),
      ),
    //mockImplementation permette di passare una funzione che viene effettivamente eseguita con i parametri ricevuti dal mock.
    create: jest.fn().mockImplementation((dto: CreateProductDto) => ({
      id: 'new-generated-uuid',
      ...dto,
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: 'IProductsService', // ← Inserire sempre il token corretto
          useValue: mockProductsService, // ← Mock del servizio
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all products', () => {
    const products = controller.getAllProducts();
    expect(products).toBeDefined();
    expect(products.length).toBeGreaterThan(0);
    expect(mockProductsService.findAll).toHaveBeenCalled();
  });

  it('should return one product', () => {
    const product = controller.getProduct(
      '1d40e473-e034-49f5-ac5d-980c7b7e7942',
    );
    expect(product).toBeDefined();
    expect(product.id).toBe('1d40e473-e034-49f5-ac5d-980c7b7e7942');
    expect(mockProductsService.findOne).toHaveBeenCalledWith(
      '1d40e473-e034-49f5-ac5d-980c7b7e7942',
    );
  });

  it('should return undefined if product not found', () => {
    const nonExistingId = 'ffffffff-ffff-ffff-ffff-ffffffffffff';
    jest.spyOn(mockProductsService, 'findOne').mockReturnValueOnce(undefined); //mocka la funzione findOne in modo che esca un undefined

    expect(() => controller.getProduct(nonExistingId)).toThrow(
      NotFoundException,
    );
    expect(mockProductsService.findOne).toHaveBeenCalledWith(nonExistingId);
  });

  it('should create a new product', () => {
    const dto: CreateProductDto = {
      name: 'Microfono',
      description: 'Condensatore USB',
      price: 59.99,
    };

    const newProduct = controller.createProduct(dto);
    expect(newProduct).toBeDefined();
    expect(newProduct).toEqual({
      id: 'new-generated-uuid',
      ...dto,
    });
    expect(mockProductsService.create).toHaveBeenCalledWith(dto);
  });
});
