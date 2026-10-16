export const STORAGE_KEYS = {
  products: 'bobera_products',
  vendors: 'bobera_vendors',
  vendorProducts: 'bobera_vendor_products',
  rounds: 'bobera_rounds',
  deliveries: 'bobera_deliveries',
};

export function loadFromLocalStorage<T>(key: string, defaultValue: T[] = []): T[] {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch {
    return defaultValue;
  }
}

export function saveToLocalStorage<T>(key: string, data: T[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
}

export function exportAllData(): Record<string, unknown[]> {
  return {
    products: loadFromLocalStorage(STORAGE_KEYS.products),
    vendors: loadFromLocalStorage(STORAGE_KEYS.vendors),
    vendorProducts: loadFromLocalStorage(STORAGE_KEYS.vendorProducts),
    rounds: loadFromLocalStorage(STORAGE_KEYS.rounds),
    deliveries: loadFromLocalStorage(STORAGE_KEYS.deliveries),
  };
}

export function importAllData(data: Record<string, unknown[]>): void {
  for (const [key, items] of Object.entries(data)) {
    if (Array.isArray(items)) {
      saveToLocalStorage(key, items);
    }
  }
}
