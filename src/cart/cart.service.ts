import { Injectable, BadRequestException, Inject, Logger } from '@nestjs/common';
import { Cart } from './entities/cart.entity';
import { CartLine } from './entities/cartLine.entity';
import { ICartService } from './interfaces/cart.service.interface';
import { IdGeneratorService } from '../common/services/id-generator.service';
import { IProductsService } from '../products/interfaces/products.service.interface';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class CartService implements ICartService {
  private readonly logger = new Logger(CartService.name);

  constructor(
    private readonly idGenerator: IdGeneratorService,
    private readonly supabaseService: SupabaseService,
    @Inject('IProductsService')
    private readonly productsService: IProductsService,
  ) {}

  async createCart(): Promise<Cart> {
    try {
      const newCart = {
        id: this.idGenerator.generateId(),
        created_at: new Date(),
        updated_at: new Date()
      };

      const { data: cart, error } = await this.supabaseService.getClient()
        .from('carts')
        .insert(newCart)
        .select()
        .single();

      if (error) {
        this.logger.error(`Error creating cart: ${JSON.stringify(error)}`);
        throw new Error(`Database error: ${error.message}`);
      }

      return this.mapToCart(cart);
    } catch (error) {
      this.logger.error(`Unexpected error in createCart: ${error.message}`);
      this.logger.error(error.stack);
      throw error;
    }
  }
  async getCart(cartId: string): Promise<Cart> {
    if (!this.idGenerator.validateId(cartId)) {
      throw new BadRequestException('Invalid cart ID format. Must be a valid UUID');
    }

    try {
      const { data: cartData, error: cartError } = await this.supabaseService.getClient()
        .from('carts')
        .select('*')
        .eq('id', cartId);

      if (cartError) {
        this.logger.error(`Error fetching cart ${cartId}: ${JSON.stringify(cartError)}`);
        throw new Error(`Database error: ${cartError.message}`);
      }

      if (!cartData || cartData.length === 0) {
        this.logger.debug(`Cart with ID ${cartId} not found`);
        throw new BadRequestException(`Cart with ID ${cartId} not found`);
      }

      const cart = cartData[0];

      const { data: lines, error: linesError } = await this.supabaseService.getClient()
        .from('cart_lines')
        .select('*')
        .eq('cart_id', cartId);

      if (linesError) {
        this.logger.error(`Error fetching cart lines for cart ${cartId}: ${JSON.stringify(linesError)}`);
        throw new Error(`Database error: ${linesError.message}`);
      }

      return this.mapToCart({ ...cart, lines: lines || [] });
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Unexpected error in getCart: ${error.message}`);
      this.logger.error(error.stack);
      throw error;
    }
  }
  async addToCart(cartId: string, cartItem: CartLine): Promise<void> {
    this.validateCartId(cartId);
    
    // Verifica che il prodotto esista
    const product = await this.productsService.findOne(cartItem.productId);
    if (!product) {
      throw new BadRequestException(`Product with ID ${cartItem.productId} not found`);
    }

    try {
      // Verifica se il carrello esiste, se non esiste lo crea
      const { data: cartData, error: cartError } = await this.supabaseService.getClient()
        .from('carts')
        .select('*')
        .eq('id', cartId);

      if (cartError) {
        this.logger.error(`Error checking cart ${cartId}: ${JSON.stringify(cartError)}`);
        throw new Error(`Database error: ${cartError.message}`);
      }

      // Se il carrello non esiste, lo crea
      if (!cartData || cartData.length === 0) {
        const newCart = {
          id: cartId,
          created_at: new Date(),
          updated_at: new Date()
        };

        const { error: createError } = await this.supabaseService.getClient()
          .from('carts')
          .insert(newCart);

        if (createError) {
          this.logger.error(`Error creating cart ${cartId}: ${JSON.stringify(createError)}`);
          throw new Error(`Database error: ${createError.message}`);
        }

        this.logger.debug(`Created new cart with ID ${cartId}`);
      }

      // Verifica se esiste già una riga per questo prodotto
      const { data: existingLines, error: findError } = await this.supabaseService.getClient()
        .from('cart_lines')
        .select('*')
        .eq('cart_id', cartId)
        .eq('product_id', cartItem.productId);

      if (findError) {
        this.logger.error(`Error checking existing cart line: ${JSON.stringify(findError)}`);
        throw new Error(`Database error: ${findError.message}`);
      }

      const existingLine = existingLines && existingLines.length > 0 ? existingLines[0] : null;

      if (existingLine) {
        // Aggiorna la quantità
        const { error: updateError } = await this.supabaseService.getClient()
          .from('cart_lines')
          .update({ 
            quantity: existingLine.quantity + cartItem.quantity,
            updated_at: new Date()
          })
          .eq('id', existingLine.id);

        if (updateError) {
          this.logger.error(`Error updating cart line: ${JSON.stringify(updateError)}`);
          throw new Error(`Database error: ${updateError.message}`);
        }
      } else {
        // Inserisce una nuova riga
        const { error: insertError } = await this.supabaseService.getClient()
          .from('cart_lines')
          .insert({
            id: this.idGenerator.generateId(),
            cart_id: cartId,
            product_id: cartItem.productId,
            quantity: cartItem.quantity,
            created_at: new Date(),
            updated_at: new Date()
          });

        if (insertError) {
          this.logger.error(`Error inserting cart line: ${JSON.stringify(insertError)}`);
          throw new Error(`Database error: ${insertError.message}`);
        }
      }

      // Aggiorna il timestamp del carrello
      const { error: updateCartError } = await this.supabaseService.getClient()
        .from('carts')
        .update({ updated_at: new Date() })
        .eq('id', cartId);

      if (updateCartError) {
        this.logger.error(`Error updating cart timestamp: ${JSON.stringify(updateCartError)}`);
        throw new Error(`Database error: ${updateCartError.message}`);
      }
    } catch (error) {
      this.logger.error(`Unexpected error in addToCart: ${error.message}`);
      this.logger.error(error.stack);
      throw error;
    }
  }

  async removeFromCart(cartId: string, productId: string): Promise<void> {
    this.validateCartId(cartId);

    try {
      const { error: deleteError } = await this.supabaseService.getClient()
        .from('cart_lines')
        .delete()
        .eq('cart_id', cartId)
        .eq('product_id', productId);

      if (deleteError) {
        this.logger.error(`Error removing cart line: ${JSON.stringify(deleteError)}`);
        throw new Error(`Database error: ${deleteError.message}`);
      }

      // Aggiorna il timestamp del carrello
      const { error: updateCartError } = await this.supabaseService.getClient()
        .from('carts')
        .update({ updated_at: new Date() })
        .eq('id', cartId);

      if (updateCartError) {
        this.logger.error(`Error updating cart timestamp: ${JSON.stringify(updateCartError)}`);
        throw new Error(`Database error: ${updateCartError.message}`);
      }
    } catch (error) {
      this.logger.error(`Unexpected error in removeFromCart: ${error.message}`);
      this.logger.error(error.stack);
      throw error;
    }
  }

  async clearCart(cartId: string): Promise<void> {
    this.validateCartId(cartId);

    try {
      const { error: deleteError } = await this.supabaseService.getClient()
        .from('cart_lines')
        .delete()
        .eq('cart_id', cartId);

      if (deleteError) {
        this.logger.error(`Error clearing cart lines: ${JSON.stringify(deleteError)}`);
        throw new Error(`Database error: ${deleteError.message}`);
      }

      // Aggiorna il timestamp del carrello
      const { error: updateCartError } = await this.supabaseService.getClient()
        .from('carts')
        .update({ updated_at: new Date() })
        .eq('id', cartId);

      if (updateCartError) {
        this.logger.error(`Error updating cart timestamp: ${JSON.stringify(updateCartError)}`);
        throw new Error(`Database error: ${updateCartError.message}`);
      }
    } catch (error) {
      this.logger.error(`Unexpected error in clearCart: ${error.message}`);
      this.logger.error(error.stack);
      throw error;
    }
  }

  private validateCartId(cartId: string): void {
    if (!this.idGenerator.validateId(cartId)) {
      throw new BadRequestException('Invalid cart ID format. Must be a valid UUID');
    }
  }

  private mapToCart(data: any): Cart {
    const cart = new Cart(data.id);
    cart.createdAt = new Date(data.created_at);
    cart.updatedAt = new Date(data.updated_at);
    if (data.lines) {
      cart.lines = data.lines.map((line: any) => ({
        productId: line.product_id,
        quantity: line.quantity
      }));
    }
    return cart;
  }
}
