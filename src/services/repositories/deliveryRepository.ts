import type { Delivery } from '../../types/index';
import type { Repository } from '../../types/index';
import { generateId, nowISO } from '../../lib/utils';
import { loadFromLocalStorage, saveToLocalStorage, STORAGE_KEYS } from '../../lib/storage';

export class DeliveryRepository implements Repository<Delivery, string> {
  private items: Delivery[];

  constructor() {
    this.items = loadFromLocalStorage<Delivery>(STORAGE_KEYS.deliveries);
  }

  private persist(): void {
    saveToLocalStorage(STORAGE_KEYS.deliveries, this.items);
  }

  getAll(): Delivery[] {
    return [...this.items].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  getById(id: string): Delivery | undefined {
    return this.items.find((item) => item.id === id);
  }

  create(item: Omit<Delivery, 'id' | 'createdAt' | 'updatedAt'>): Delivery {
    const now = nowISO();
    const newItem: Delivery = {
      ...item,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    this.items.push(newItem);
    this.persist();
    return newItem;
  }

  update(id: string, item: Partial<Delivery>): Delivery | undefined {
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

  getByRoundId(roundId: string): Delivery[] {
    return this.items.filter((d) => d.roundId === roundId);
  }

  getByVendorId(vendorId: string): Delivery[] {
    return this.items.filter((d) => d.vendorId === vendorId);
  }

  getByProductId(productId: string): Delivery[] {
    return this.items.filter((d) => d.productId === productId);
  }
}
