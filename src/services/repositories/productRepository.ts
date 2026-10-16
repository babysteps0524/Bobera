import type { Product } from '../../types/index';
import type { Repository } from '../../types/index';
import { generateId, nowISO } from '../../lib/utils';
import { loadFromLocalStorage, saveToLocalStorage, STORAGE_KEYS } from '../../lib/storage';

export class ProductRepository implements Repository<Product, string> {
  private items: Product[];

  constructor() {
    this.items = loadFromLocalStorage<Product>(STORAGE_KEYS.products);
  }

  private persist(): void {
    saveToLocalStorage(STORAGE_KEYS.products, this.items);
  }

  getAll(): Product[] {
    return [...this.items];
  }

  getById(id: string): Product | undefined {
    return this.items.find((item) => item.id === id);
  }

  create(item: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product {
    const now = nowISO();
    const newItem: Product = {
      ...item,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    this.items.push(newItem);
    this.persist();
    return newItem;
  }

  update(id: string, item: Partial<Product>): Product | undefined {
    const index = this.items.findIndex((i) => i.id === id);
    if (index === -1) return undefined;

    const now = nowISO();
    this.items[index] = {
      ...this.items[index],
      ...item,
      updatedAt: now,
    };
    this.persist();
    return this.items[index];
  }

  delete(id: string): boolean {
    const index = this.items.findIndex((i) => i.id === id);
    if (index === -1) return false;

    this.items.splice(index, 1);
    this.persist();
    return true;
  }
}
