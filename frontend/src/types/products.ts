import type { Timestamps } from ".";
import type { User } from "./auth";

export interface Product {
  _id: string;
  seller?:  User;
  name: string;
  brand: string;
  productCode?: string;
  brandCode?: string;
  productLink?: string;
  // productSlots?: number;
  productPlatform?: string;
  isActive: boolean;
  ratingSlots?:number;
  reviewSlots?:number;
  onlyOrderSlots?:number;
  reviewSubmittedSlots?:number;
  bookedRatingSlots?:number;
  bookedReviewSlots?:number;
  bookedOnlyOrderSlots?:number;
  bookedReviewSubmitted?:number;
  adminLess?:number;
  medLess?:number;
  buyerLess?:number;
}

export interface ActiveProduct {
  _id: string;
  name: string;
  brand: string;
  productCode: string;
  brandCode: string;
  productLink?: string;
  productPlatform: string;
  isActive?: boolean;
  // slots?:number;
  ratingSlots?:number;
  reviewSlots?:number;
  onlyOrderSlots?:number;
  reviewSubmittedSlots?:number;
  availableRatingSlots?:number;
  availableReviewSlots?:number;
  availableOnlyOrderSlots?:number;
  availableReviewSubmitted?:number;
  buyerLess?:number;
  adminLess?:number;
  medLess?:number;
}

export interface ProductWithDetails extends Product, Timestamps {
  seller: User;
}



export interface CreateProductData {
  seller: string;
  name: string;
  brand: string;
  productCode?: string;
  brandCode?: string;
  productLink?: string;
  // productSlots?: number;
  ratingSlots?:number;
  reviewSlots?:number;
  onlyOrderSlots?:number;
  reviewSubmittedSlots?:number;
  productPlatform?: string;
  isActive?: boolean;
  adminLess?:number;
  medLess?:number;
  buyerLess?:number;
}

export interface UpdateProductData extends Partial<CreateProductData> {};
