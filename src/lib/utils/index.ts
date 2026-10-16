export function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

export function nowISO(): string {
  return new Date().toISOString();
}

export function deepClone<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

export function formatCurrencyKRW(value: number): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function parseCurrencyKRW(value: string): number {
  return Number(value.replace(/[^\d.-]/g, '')) || 0;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}
