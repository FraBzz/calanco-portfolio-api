import { Test, TestingModule } from '@nestjs/testing';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsService } from './products.service';

describe('ProductsService', () => {
  let service: ProductsService;
  let supabaseService: SupabaseService;

  const mockSupabaseService = {
    // Aggiungi qui i metodi mock di cui hai bisogno
    getClient: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: SupabaseService,
          useValue: mockSupabaseService,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    supabaseService = module.get<SupabaseService>(SupabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all products', async () => {
    jest.spyOn(service, 'findAll').mockResolvedValueOnce([
      {
        id: '1',
        name: 'Product 1',
        description: 'Description 1',
        price: 100,
      },
    ]);

    const products = await service.findAll();
    expect(products).toBeDefined();
    expect(products.length).toBe(1);
    expect(products[0].name).toBe('Product 1');
  });

  it('should return one product by id', async () => {
    jest.spyOn(service, 'findOne').mockResolvedValueOnce({
      id: '1',
      name: 'Product 1',
      description: 'Description 1',
      price: 100,
    });

    const product = await service.findOne('1');
    expect(product).toBeDefined();
    expect(product?.id).toBe('1');
  });

  it('should create a product', async () => {
    const dto: CreateProductDto = {
      name: 'New Product',
      description: 'New Description',
      price: 200,
    };

    jest.spyOn(service, 'create').mockResolvedValueOnce({
      id: '2',
      ...dto,
    });

    const newProduct = await service.create(dto);
    expect(newProduct).toBeDefined();
    expect(newProduct.id).toBe('2');
    expect(newProduct.name).toBe(dto.name);
  });
});
