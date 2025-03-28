import { Module } from '@nestjs/common';
import { CatsService } from '../cats/cats.service';
import { CatsController } from './cats.controller';

@Module({
  controllers: [CatsController], // <-- registra il controller
  providers: [
    {
      provide: 'ICatsService', // Token da usare nel controller
      useClass: CatsService, // Classe concreta che Nest istanzierà
    },
  ], // <-- registra il servizio
  //   exports: ['ICatsService'], //per usarw cats service in altri moduli
})
export class CatsModule {}
