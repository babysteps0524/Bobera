export interface Product {
  id: string;
  roundId?: string;
  name: string;
  category: string;
  spec: string;
  unit: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Vendor {
  id: string;
  name: string;
  person: string;
  phone: string;
  address?: string;
  email?: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VendorProduct {
  id: string;
  vendorId: string;
  productId: string;
  spec?: string;
  memo?: string;
}

export interface DeliveryRound {
  id: string;
  name: string;
  period?: string;
  status: 'preparing' | 'in_progress' | 'completed';
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Delivery {
  id: string;
  productId: string;
  roundId?: string;
  vendorId?: string;
  productName: string;
  vendorName: string;
  vendorPerson?: string;
  vendorPhone?: string;
  requestedAt: string;
  arrivedAt?: string;
  quantity: number;
  unitPrice: number;
  totalCost: number;
  deliveryFee: number;
  unitSalePrice: number;
  totalSalePrice: number;
  marginAmount: number;
  marginRate?: number;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StatsSummary {
  totalCount: number;
  totalQuantity: number;
  totalCost: number;
  totalDeliveryFee: number;
  totalSalePrice: number;
  totalMargin: number;
  weightedMarginRate: number;
}

export interface FilterState {
  keyword: string;
  productId: string;
  roundId: string;
  vendorId: string;
  startDate: string;
  endDate: string;
  sortBy: 'latest' | 'oldest' | 'amount' | 'quantity';
  sortOrder: 'asc' | 'desc';
}

export interface Repository<T, TId> {
  getAll(): T[];
  getById(id: TId): T | undefined;
  create(item: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): T;
  update(id: TId, item: Partial<T>): T | undefined;
  delete(id: TId): boolean;
}

export interface DeliveryFilters extends FilterState {}
