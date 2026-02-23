import type { Timestamps } from ".";
import type { User } from "./auth";
import type { Product } from "./products";

export enum Role {
  ADMIN = 'admin',
  MEDIATOR = 'mediator',
  SELLER = 'seller',
  USER = 'user',
}

export enum Process {
  ORDER = 'order',
  REFUND = 'refund',
}

export enum TransactionStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  REFILL = 'refill',
  PAYMENT_DONE = 'payment_done',
  REFUND_PLACED = 'refund_placed',
  REFUND_NOT_PLACED = 'refund_not_placed',
  BRAND_RELEASED = 'brand_released'
}

export const WHITELISTED_MEDIATOR_NICKNAMES = ['Relamp Digital'];

/* -------- ORDER -------- */
export interface Order {
  _id: string;
  product: string | Product;
  //mediator: string | User;
  name: string;
  email: string;
  phone: string;
  orderNumber: string;
  orderDate: string;
  orderAmount: number;
  lessPrice: number;
  oldOrderNumber?: string;
  orderSS?: string;
  priceBreakupSS?: string;
  orderStatus: TransactionStatus;
  rejectionMessage?: string;
  refillMessage?: string;
  note?: string;
  dealType?: string;
  isReplacement?:string;
  ratingOrReview?:string;
  exchangeProduct?:string;
  
}

export interface OrderWithDetails extends Order, Timestamps {
  product: Product;
  mediator: User;
}

export interface OrdersResponse {

    items: OrderWithDetails[];
    pagination:{
      currentPage:number;
      totalPages:number;
      totalCount  :number;
      hasNextPage:boolean;
      hasPrevPage:boolean;
      limit:number;
    }
  
}

export interface CreateOrderData {
  product: string;
  mediator: string;
  name: string;
  email: string;
  phone: string;
  orderNumber: string;
  orderDate: string;
  orderAmount: number;
  lessPrice: number;
  oldOrderNumber?: string;
  orderSS?: string;
  priceBreakupSS?: string;
  orderStatus?: TransactionStatus;
  note?:string;
  dealType?: string;
  isReplacement?:string;
  ratingOrReview?:string;
  exchangeProduct?:string;
}

export interface UpdateOrderData{
  name?:string;
  email?:string;
  phone?:string;
  orderDate?:string;
  orderAmount?:number;
  lessPrice?:number;
  product?:string;
  dealType?:string;
  isReplacement?:string;
  oldOrderNumber?:string;
  ratingOrReview?:string;
  exchangeProduct?:string;
}

export interface Refund {
  _id: string;
  order: string | Order;
  upiId?: string;
  bankInfo?:{
      accountNumber:string,
      ifscCode:string
  },
  reviewLink?: string;
  deliveredSS?: string;
  reviewSS?: string;
  sellerFeedbackSS?: string;
  returnWindowSS?: string;
  isReturnWindowClosed:boolean;
  status: TransactionStatus;
  rejectionMessage?: string;
  refillMessage?: string;
  note?: string;
}

export interface RefundWithDetails extends Refund, Timestamps {
  order: OrderWithDetails;
}

export interface RefundsResponse {
  items: RefundWithDetails[];
  pagination:{
      currentPage:number;
      totalPages:number;
      totalCount  :number;
      hasNextPage:boolean;
      hasPrevPage:boolean;
      limit:number;
    };
}

export interface  UpdateRefundData {
    reviewLink?: string;
    paymentMethod: 'upi' | 'bank';
    upiId?: string;
    accountNumber?: string;
    ifscCode?: string;
    isReturnWindowClosed: 'yes' | 'no';
    status: 'accepted' | 'rejected' | 'pending' | 'payment_done' | 'refill';
    rejectionMessage?: string;
    note?: string;
};