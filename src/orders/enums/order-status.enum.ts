export type OrderStatus = 
  | 'pending'
  | 'confirmed' 
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export const ORDER_STATUSES = [
  'pending',
  'confirmed',
  'processing', 
  'shipped',
  'delivered',
  'cancelled',
  'refunded'
] as const;

export const ORDER_STATUS_DESCRIPTIONS = {
  pending: 'In attesa di conferma',
  confirmed: 'Confermato',
  processing: 'In elaborazione',
  shipped: 'Spedito',
  delivered: 'Consegnato',
  cancelled: 'Annullato',
  refunded: 'Rimborsato'
};