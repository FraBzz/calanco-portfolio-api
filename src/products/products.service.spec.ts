import { Test, TestingModule } from '@nestjs/testing';
import { IProductsService } from './interfaces/products.service.interface';
import { ProductsService } from './products.service';

describe('ProductsService', () => {
  let service: IProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'IProductsService',
          useClass: ProductsService
        }
      ],
    }).compile();

    service = module.get<IProductsService>('IProductsService');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all products', () => {
    const products = service.findAll();
    expect(products).toBeDefined();
    expect(products.length).toBeGreaterThan(0);
  });

  it('should return one product by id', () => {
    const products = service.findAll();
    const product = service.findOne(products[0].id);
    expect(product).toBeDefined();
    expect(product?.id).toBe(products[0].id);
  })
});
