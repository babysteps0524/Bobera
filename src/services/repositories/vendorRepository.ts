import type { Vendor } from '../../types/index';
import type { Repository } from '../../types/index';
import { generateId, nowISO } from '../../lib/utils';
import { loadFromLocalStorage, saveToLocalStorage, STORAGE_KEYS } from '../../lib/storage';

export class VendorRepository implements Repository<Vendor, string> {
  private items: Vendor[];

  constructor() {
    this.items = loadFromLocalStorage<Vendor>(STORAGE_KEYS.vendors);
  }

  private persist(): void {
    saveToLocalStorage(STORAGE_KEYS.vendors, this.items);
  }

  getAll(): Vendor[] {
    return [...this.items];
  }

  getById(id: string): Vendor | undefined {
    return this.items.find((item) => item.id === id);
  }

  create(item: Omit<Vendor, 'id' | 'createdAt' | 'updatedAt'>): Vendor {
    const now = nowISO();
    const newItem: Vendor = {
      ...item,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    this.items.push(newItem);
    this.persist();
    return newItem;
  }

  update(id: string, item: Partial<Vendor>): Vendor | undefined {
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
