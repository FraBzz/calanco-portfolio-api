import { Test, TestingModule } from '@nestjs/testing';
import { CreateProductDto } from './dto/create-product.dto';
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

  it('should create a product', () => {
    const dto: CreateProductDto = {
      name: 'Nuovo Prodotto',
      description: 'Descrizione prodotto',
      price: 100,
    };
    const newProduct = service.create(dto);
    expect(newProduct).toBeDefined();
    expect(newProduct.id).toBeDefined();
    expect(newProduct.name).toBe(dto.name);
  });
});
