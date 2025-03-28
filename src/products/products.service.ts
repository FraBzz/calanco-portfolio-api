import { Injectable } from '@nestjs/common';
import { Product } from './entities/product.entity';
import { IProductsService } from './interfaces/products.service.interface';

@Injectable()
export class ProductsService implements IProductsService {
    private products: Product[] = [
        { id: '1d40e473-e034-49f5-ac5d-980c7b7e7942', name: 'Tastiera', description: 'Meccanica RGB', price: 79.99 },
        { id: 'a35d7362-9466-4118-994d-1e1d846442fd', name: 'Mouse', description: 'Wireless ergonomico', price: 49.99 },
        { id: '09e5dcb1-0612-4ef9-a7dd-d917f4578201', name: 'Monitor', description: '27 pollici IPS', price: 179.99 },
        { id: '10af334b-c766-4018-a64c-dc6c9ecff234', name: 'Cuffie', description: 'Gaming Surround', price: 89.99 },
        { id: '51132cd4-75d2-4d01-97ed-02b3cd613472', name: 'Microfono', description: 'USB condensatore', price: 59.99 },
    ]
    
    findAll(): Product[] {
        return this.products;
    }

    findOne(id: string): Product | undefined {
        return this.products.find(product => product.id === id);
    }
}
