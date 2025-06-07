import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { CommonModule } from '../common/common.module';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [CommonModule, SupabaseModule],
  controllers: [OrdersController],
  providers: [
    {
      provide: 'IOrdersService',
      useClass: OrdersService,
    },
  ],
  exports: ['IOrdersService'],
})
export class OrdersModule {}
