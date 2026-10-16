import { describe, it, expect } from 'bun:test';
import {
  calculateDeliveryAmounts,
  calculateWeightedMarginRate,
  calculateTotalCount,
  calculateTotalQuantity,
  calculateTotalCost,
  calculateTotalDeliveryFee,
  calculateTotalSalePrice,
  calculateTotalMargin,
  roundMoney,
  formatMarginRate,
} from '../../lib/calculations/delivery';

describe('납품 금액 계산', () => {
  it('총원가 = 수량 × 개당 원가', () => {
    const result = calculateDeliveryAmounts({ quantity: 5, unitPrice: 10000, deliveryFee: 0, unitSalePrice: 15000 });
    expect(result.totalCost).toBe(50000);
  });

  it('총 납품금액(매출) = 수량 × 개당 단가', () => {
    const result = calculateDeliveryAmounts({ quantity: 5, unitPrice: 10000, deliveryFee: 0, unitSalePrice: 15000 });
    expect(result.totalSalePrice).toBe(75000);
  });

  it('마진금액 = 총 납품금액 − 총원가 − 배송료', () => {
    const result = calculateDeliveryAmounts({ quantity: 5, unitPrice: 10000, deliveryFee: 5000, unitSalePrice: 15000 });
    expect(result.marginAmount).toBe(20000); // 75000 - 50000 - 5000
  });

  it('마진율 = 마진금액 ÷ 총 납품금액 × 100', () => {
    const result = calculateDeliveryAmounts({ quantity: 5, unitPrice: 10000, deliveryFee: 5000, unitSalePrice: 15000 });
    expect(result.marginRate).toBeCloseTo(26.67, 1); // 20000 / 75000 * 100 = 26.666...
  });

  it('총 납품금액이 0이면 마진율은 null', () => {
    const result = calculateDeliveryAmounts({ quantity: 0, unitPrice: 10000, deliveryFee: 0, unitSalePrice: 15000 });
    expect(result.marginRate).toBeNull();
  });

  it('매출이 0이면 마진율은 null (단가도 0)', () => {
    const result = calculateDeliveryAmounts({ quantity: 5, unitPrice: 10000, deliveryFee: 0, unitSalePrice: 0 });
    expect(result.marginRate).toBeNull();
  });

  it('경계값: 수량이 1인 경우', () => {
    const result = calculateDeliveryAmounts({ quantity: 1, unitPrice: 1000, deliveryFee: 0, unitSalePrice: 2000 });
    expect(result.totalCost).toBe(1000);
    expect(result.totalSalePrice).toBe(2000);
    expect(result.marginAmount).toBe(1000);
  });

  it('경계값: 금액이 0인 경우', () => {
    const result = calculateDeliveryAmounts({ quantity: 5, unitPrice: 0, deliveryFee: 0, unitSalePrice: 0 });
    expect(result.totalCost).toBe(0);
    expect(result.totalSalePrice).toBe(0);
    expect(result.marginAmount).toBe(0);
    expect(result.marginRate).toBeNull();
  });

  it('음수 배송료는 마진에서 비용으로 차감', () => {
    const result = calculateDeliveryAmounts({ quantity: 1, unitPrice: 1000, deliveryFee: 500, unitSalePrice: 2000 });
    expect(result.marginAmount).toBe(500); // 2000 - 1000 - 500
  });
});

describe('가중 평균 마진율 계산', () => {
  it('전체 마진금액 합계 ÷ 전체 납품금액 합계 × 100', () => {
    const deliveries = [
      { marginAmount: 10000, totalSalePrice: 50000 },
      { marginAmount: 20000, totalSalePrice: 100000 },
    ];
    const rate = calculateWeightedMarginRate(deliveries);
    expect(rate).toBeCloseTo(20, 1); // 30000 / 150000 * 100 = 20
  });

  it('매출이 0이면 가중 마진율은 0', () => {
    const deliveries = [
      { marginAmount: 0, totalSalePrice: 0 },
      { marginAmount: 0, totalSalePrice: 0 },
    ];
    const rate = calculateWeightedMarginRate(deliveries);
    expect(rate).toBe(0);
  });
});

describe('집계 함수', () => {
  const deliveries = [
    { quantity: 10, totalCost: 50000, deliveryFee: 5000, totalSalePrice: 75000, marginAmount: 20000 },
    { quantity: 5, totalCost: 30000, deliveryFee: 3000, totalSalePrice: 50000, marginAmount: 17000 },
  ];

  it('총 건수', () => {
    expect(calculateTotalCount(deliveries)).toBe(2);
  });

  it('총 수량', () => {
    expect(calculateTotalQuantity(deliveries)).toBe(15);
  });

  it('총원가 합계', () => {
    expect(calculateTotalCost(deliveries)).toBe(80000);
  });

  it('총 배송료 합계', () => {
    expect(calculateTotalDeliveryFee(deliveries)).toBe(8000);
  });

  it('총 납품금액 합계', () => {
    expect(calculateTotalSalePrice(deliveries)).toBe(125000);
  });

  it('총 마진금액 합계', () => {
    expect(calculateTotalMargin(deliveries)).toBe(37000);
  });
});

describe('반올림 및 포맷팅', () => {
  it('roundMoney는 소수점 2자리까지 반올림', () => {
    expect(roundMoney(123.456)).toBe(123.46);
    expect(roundMoney(123.454)).toBe(123.45);
  });

  it('formatMarginRate는 null이면 계산 불가', () => {
    expect(formatMarginRate(null)).toBe('계산 불가');
  });

  it('formatMarginRate는 퍼센트 문자열', () => {
    expect(formatMarginRate(25.5)).toBe('25.5%');
  });
});
