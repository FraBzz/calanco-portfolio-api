import { CreateCatDto } from "../dtos/create-cat.dto";
import { Cat } from "../entities/cat.entity";

export interface ICatsService {
    create(catDto: CreateCatDto): void;
    findAll(): Promise<Cat[]>;
  }  