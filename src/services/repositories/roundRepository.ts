import type { DeliveryRound } from '../../types/index';
import type { Repository } from '../../types/index';
import { generateId, nowISO } from '../../lib/utils';
import { loadFromLocalStorage, saveToLocalStorage, STORAGE_KEYS } from '../../lib/storage';

export class DeliveryRoundRepository implements Repository<DeliveryRound, string> {
  private items: DeliveryRound[];

  constructor() {
    this.items = loadFromLocalStorage<DeliveryRound>(STORAGE_KEYS.rounds);
  }

  private persist(): void {
    saveToLocalStorage(STORAGE_KEYS.rounds, this.items);
  }

  getAll(): DeliveryRound[] {
    return [...this.items];
  }

  getById(id: string): DeliveryRound | undefined {
    return this.items.find((item) => item.id === id);
  }

  create(item: Omit<DeliveryRound, 'id' | 'createdAt' | 'updatedAt'>): DeliveryRound {
    const now = nowISO();
    const newItem: DeliveryRound = {
      ...item,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    this.items.push(newItem);
    this.persist();
    return newItem;
  }

  update(id: string, item: Partial<DeliveryRound>): DeliveryRound | undefined {
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
