import { Injectable } from '@nestjs/common';
import { Cat } from './entities/cat.entity';
import { ICatsService } from './interfaces/cat-service.interface';

@Injectable()
export class CatsService implements ICatsService {
  private readonly cats: Cat[] = [];

  create(cat: Cat) {
    this.cats.push(cat);
  }

  async findAll(): Promise<Cat[]> {
    return this.cats;
  }
}
