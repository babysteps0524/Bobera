export interface DeliveryCalculationInputs {
  quantity: number;
  unitPrice: number;
  deliveryFee: number;
  unitSalePrice: number;
}

export interface DeliveryCalculationResult {
  totalCost: number;
  totalSalePrice: number;
  totalCostWithFee: number;
  marginAmount: number;
  marginRate: number | null;
}

/**
 * 납품 기록의 금액을 자동 계산합니다.
 *
 * 계산 규칙:
 * - 총원가 = 수량 × 개당 원가
 * - 총 납품금액(매출) = 수량 × 개당 단가
 * - 총 비용 = 총원가 + 배송료
 * - 마진금액 = 총 납품금액 − 총원가 − 배송료
 * - 마진율 = 마진금액 ÷ 총 납품금액 × 100 (총 납품금액이 0이면 null)
 */
export function calculateDeliveryAmounts(
  inputs: DeliveryCalculationInputs
): DeliveryCalculationResult {
  const { quantity, unitPrice, deliveryFee, unitSalePrice } = inputs;

  const totalCost = quantity * unitPrice;
  const totalSalePrice = quantity * unitSalePrice;
  const totalCostWithFee = totalCost + deliveryFee;
  const marginAmount = totalSalePrice - totalCost - deliveryFee;
  const marginRate = totalSalePrice > 0 ? (marginAmount / totalSalePrice) * 100 : null;

  return {
    totalCost: roundMoney(totalCost),
    totalSalePrice: roundMoney(totalSalePrice),
    totalCostWithFee: roundMoney(totalCostWithFee),
    marginAmount: roundMoney(marginAmount),
    marginRate: marginRate !== null ? roundMoney(marginRate) : null,
  };
}

/**
 * 여러 납품 기록의 가중 평균 마진율을 계산합니다.
 * 단순 산술평균이 아닌, 전체 마진금액 합계 ÷ 전체 납품금액 합계 × 100 입니다.
 */
export function calculateWeightedMarginRate(deliveries: {
  marginAmount: number;
  totalSalePrice: number;
}[]): number {
  const totalMargin = deliveries.reduce((sum, d) => sum + d.marginAmount, 0);
  const totalSale = deliveries.reduce((sum, d) => sum + d.totalSalePrice, 0);

  if (totalSale === 0) return 0;
  return roundMoney((totalMargin / totalSale) * 100);
}

/**
 * 납품 건수 합계를 계산합니다.
 */
export function calculateTotalCount(deliveries: { quantity: number }[]): number {
  return deliveries.length;
}

/**
 * 총 수량 합계를 계산합니다.
 */
export function calculateTotalQuantity(deliveries: { quantity: number }[]): number {
  return deliveries.reduce((sum, d) => sum + d.quantity, 0);
}

/**
 * 총원가 합계를 계산합니다.
 */
export function calculateTotalCost(deliveries: { totalCost: number }[]): number {
  return deliveries.reduce((sum, d) => sum + d.totalCost, 0);
}

/**
 * 총 배송료 합계를 계산합니다.
 */
export function calculateTotalDeliveryFee(deliveries: { deliveryFee: number }[]): number {
  return deliveries.reduce((sum, d) => sum + d.deliveryFee, 0);
}

/**
 * 총 납품금액(매출) 합계를 계산합니다.
 */
export function calculateTotalSalePrice(deliveries: { totalSalePrice: number }[]): number {
  return deliveries.reduce((sum, d) => sum + d.totalSalePrice, 0);
}

/**
 * 총 마진금액 합계를 계산합니다.
 */
export function calculateTotalMargin(deliveries: { marginAmount: number }[]): number {
  return deliveries.reduce((sum, d) => sum + d.marginAmount, 0);
}

/**
 * 금액을 소수점 2자리까지 반올림합니다.
 */
export function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * 금액을 한국어 형식(천 단위 구분, 원 단위)으로 포맷팅합니다.
 */
export function formatMoney(value: number): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * 숫자를 천 단위 구분 기호가 있는 문자열로 포맷팅합니다.
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('ko-KR').format(value);
}

/**
 * 퍼센트를 소수점 1자리까지 포맷팅합니다. null이면 '계산 불가'를 반환합니다.
 */
export function formatMarginRate(rate: number | null): string {
  if (rate === null) return '계산 불가';
  return `${rate.toFixed(1)}%`;
}

/**
 * 날짜를 한국어 형식(YYYY년 MM월 DD일)으로 포맷팅합니다.
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

/**
 * 날짜를 YYYY-MM-DD 형식으로 포맷팅합니다 (input 값용).
 */
export function formatDateInput(dateString: string): string {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
}
