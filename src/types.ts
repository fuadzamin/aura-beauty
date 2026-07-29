export interface Treatment {
  id: string;
  name: string;
  category: string;
  duration: string;
  description: string;
  imageUrl: string;
  downtime?: string;
  benefits?: string[];
  procedure?: string[];
}

export interface ProductVariant {
  size: string;
  stock: number;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  description?: string;
  size?: string;
  price?: number;
  stock?: number;
  variants: ProductVariant[];
}
