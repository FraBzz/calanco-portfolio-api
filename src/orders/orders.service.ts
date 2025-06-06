import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { IdGeneratorService } from '../common/services/id-generator.service';
import { IOrdersService } from './orders.interface';
import { CheckoutDto, OrderResponseDto } from './dto/checkout.dto';

@Injectable()
export class OrdersService implements IOrdersService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly idGeneratorService: IdGeneratorService,
  ) {}

  async checkout(checkoutDto: CheckoutDto): Promise<OrderResponseDto> {
    const { cartId } = checkoutDto;

    // 1. Recupera il carrello con i suoi prodotti
    const cartResult = await this.supabaseService.getClient()
      .from('cart_lines')
      .select(`
        id,
        quantity,
        products (
          id,
          name,
          price
        )
      `)
      .eq('cart_id', cartId);

    if (cartResult.error) {
      throw new BadRequestException(`Errore nel recuperare il carrello: ${cartResult.error.message}`);
    }

    if (!cartResult.data || cartResult.data.length === 0) {
      throw new BadRequestException('Il carrello è vuoto o non esiste');
    }

    const cartLines = cartResult.data;    // 2. Calcola il totale
    const totalAmount = cartLines.reduce((total, line) => {
      const product = Array.isArray(line.products) ? line.products[0] : line.products;
      const productPrice = product?.price || 0;
      return total + (productPrice * line.quantity);
    }, 0);    // 3. Crea l'ordine
    const orderId = this.idGeneratorService.generateId();
    const orderResult = await this.supabaseService.getClient()
      .from('orders')
      .insert({
        id: orderId,
        cart_id: cartId,
        total_amount: totalAmount,
        status: 'confirmed'
      })
      .select()
      .single();

    if (orderResult.error) {
      throw new BadRequestException(`Errore nella creazione dell'ordine: ${orderResult.error.message}`);
    }    // 4. Crea le righe dell'ordine
    const orderLines = cartLines.map(line => {
      const product = Array.isArray(line.products) ? line.products[0] : line.products;
      return {
        id: this.idGeneratorService.generateId(),
        order_id: orderId,
        product_id: product?.id,
        quantity: line.quantity,
        unit_price: product?.price || 0,
        total_price: (product?.price || 0) * line.quantity
      };
    });

    const orderLinesResult = await this.supabaseService.getClient()
      .from('order_lines')
      .insert(orderLines)
      .select();

    if (orderLinesResult.error) {
      throw new BadRequestException(`Errore nella creazione delle righe ordine: ${orderLinesResult.error.message}`);
    }

    // 5. Svuota il carrello (opzionale - per demo lo manteniamo)
    // await this.supabaseService.getClient()
    //   .from('cart_lines')
    //   .delete()
    //   .eq('cart_id', cartId);

    // 6. Restituisce l'ordine completo
    return this.getOrder(orderId);
  }

  async getOrder(orderId: string): Promise<OrderResponseDto> {
    const orderResult = await this.supabaseService.getClient()
      .from('orders')
      .select(`
        id,
        cart_id,
        total_amount,
        status,
        created_at,
        order_lines (
          id,
          product_id,
          quantity,
          unit_price,
          total_price
        )
      `)
      .eq('id', orderId)
      .single();

    if (orderResult.error) {
      throw new NotFoundException(`Ordine non trovato: ${orderResult.error.message}`);
    }

    const order = orderResult.data;

    return {
      id: order.id,
      cartId: order.cart_id,
      totalAmount: order.total_amount,
      status: order.status,
      createdAt: order.created_at,
      orderLines: order.order_lines.map(line => ({
        id: line.id,
        productId: line.product_id,
        quantity: line.quantity,
        unitPrice: line.unit_price,
        subtotal: line.total_price
      }))
    };
  }
}
