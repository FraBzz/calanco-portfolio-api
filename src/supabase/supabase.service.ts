import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private client: SupabaseClient;
  private readonly logger = new Logger(SupabaseService.name);

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_KEY');
    
    this.logger.debug(`Initializing Supabase with URL: ${supabaseUrl?.substring(0, 20)}...`);
    
    if (!supabaseUrl || !supabaseKey) {
      this.logger.error('Missing Supabase credentials');
      throw new Error('Missing Supabase credentials');
    }

    try {
      this.client = createClient(supabaseUrl, supabaseKey);
      this.logger.log('Supabase client initialized successfully');
    } catch (error) {
      this.logger.error(`Error initializing Supabase client: ${error.message}`);
      throw error;
    }
  }

  getClient(): SupabaseClient {
    if (!this.client) {
      this.logger.error('Supabase client not initialized');
      throw new Error('Supabase client not initialized');
    }
    return this.client;
  }
}