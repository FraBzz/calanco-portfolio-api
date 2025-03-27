import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsModule } from './modules/cats/cats.module';

@Module({
  imports: [CatsModule], // 👈 così NestJS riconosce il CatsModule
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
