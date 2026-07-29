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

export interface Booking {
  id: string;
  clientName: string;
  clientPhone: string;
  treatmentName: string;
  branch: string;
  date: string;
  time: string;
  doctor: string;
  status: 'Pending' | 'Terkonfirmasi' | 'Selesai' | 'Dibatalkan';
  totalAmount: number;
}

export interface PurchaseItem {
  productName: string;
  size: string;
  quantity: number;
  pricePerUnit: number;
  type?: 'Treatment' | 'Product';
}

export interface ProductPurchase {
  id: string;
  customerName: string;
  customerPhone: string;
  items: PurchaseItem[];
  totalAmount: number;
  date: string;
  paymentMethod: string;
  status: 'Lunas' | 'Dikirim' | 'Selesai' | 'Dibatalkan';
  branch: string;
  doctor?: string;
  discountAmount?: number;
  cashAmount?: number;
  changeAmount?: number;
}
