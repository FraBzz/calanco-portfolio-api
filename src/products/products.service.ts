import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './entities/product.entity';
import { IProductsService } from './interfaces/products.service.interface';

@Injectable()
export class ProductsService implements IProductsService {
    private products: Product[] = [
        { id: uuid(), name: 'Tastiera', description: 'Meccanica RGB', price: 79.99 },
        { id: uuid(), name: 'Mouse', description: 'Wireless ergonomico', price: 49.99 },
        { id: uuid(), name: 'Monitor', description: '27 pollici IPS', price: 179.99 },
        { id: uuid(), name: 'Cuffie', description: 'Gaming Surround', price: 89.99 },
        { id: uuid(), name: 'Microfono', description: 'USB condensatore', price: 59.99 },
    ]
    
    findAll(): Product[] {
        return this.products;
    }

    findOne(id: string): Product | undefined {
        return this.products.find(product => product.id === id);
    }

    create(dto: CreateProductDto): Product {
        const newProduct: Product = { id: uuid(), ...dto };
        this.products.push(newProduct);
        return newProduct;
      }
}
